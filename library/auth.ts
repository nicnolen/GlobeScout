import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import Users, { UsersDocument } from '../models/users/Users';
import { createAccessToken, createRefreshToken, createResetToken } from '../utils/authUtils';
import { cookieOptions } from '../utils/helpers/authHelpers';
import { sendMail } from '../utils/nodemailer';
import { catchErrorHandler } from '../utils/errorHandlers';

const JWT_SECRET = process.env.JWT_SECRET || '';

// Register User
export async function register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'No email address provided' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'No password provided' });
            return;
        }

        const user = await Users.findOne({ email });

        if (user) {
            res.status(409).json({ message: `User with email ${user.email} already exists` });
            return;
        }

        const newUser = new Users({ email, password });

        // Need to use save to trigger Mongoose pre('save') hook to hash passwords before storing them
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: unknown) {
        const customMessage = 'Error registering user';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
    }
}

// Login User
export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: 'No email address provided' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'No password provided' });
            return;
        }

        const user = await Users.findOneAndUpdate({ email }, { lastLogin: new Date(), active: true }, { new: true });
        if (!user) {
            res.status(401).json({ message: 'Invalid email' });
            return;
        }

        // Validate password
        const isPasswordValid = await user.comparePasswords(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const accessToken = createAccessToken(user._id.toString(), user.role);
        const refreshToken = createRefreshToken(user._id.toString(), user.role);

        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const accessTokenCookieOptions = cookieOptions(accessTokenMaxAge);
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);

        const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        const refreshTokenCookieOptions = cookieOptions(refreshTokenMaxAge);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        if (user.authentication.enabled) {
            res.status(200).json({ message: 'Login successful, redirecting to 2fa' });
            return;
        }

        // Use the exact same options as the access token
        res.cookie('userRole', user.role, accessTokenCookieOptions);

        res.status(200).json({ message: 'Login successful' });
    } catch (err: unknown) {
        const customMessage = 'User login attempt failed';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
    }
}

// Logout User
export async function logout(req: Request, res: Response): Promise<void> {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(200).json({ message: 'User is not logged in.' });
            return;
        }

        // Get user info from the token
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };

        const updatedUser = await Users.findOneAndUpdate({ _id: decoded.id }, { active: false }, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('userRole');

        res.status(200).json({ message: 'Logout successful' });
    } catch (err: unknown) {
        const customMessage = 'Error during logout';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
    }
}

// Email the user with a forgot password link
export async function forgot(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await Users.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { resetToken, hashedToken } = createResetToken();
        const resetTokenExpiration = Date.now() + 15 * 60 * 1000; // set expiration (15 mins)

        const updateResult = await Users.findOneAndUpdate(
            { email },
            {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: resetTokenExpiration,
            },
            { new: true },
        );

        if (!updateResult) {
            res.status(500).json({ message: 'Failed to update user with reset token' });
            return;
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password`;

        const to = user.email;
        const subject = 'Password Reset';
        const html = `Click this link to reset your password: ${resetUrl}`;

        await sendMail(to, subject, html);

        const resetTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const resetTokenCookieOptions = cookieOptions(resetTokenMaxAge);

        res.cookie('resetToken', resetToken, resetTokenCookieOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err: unknown) {
        const customMessage = 'Error sending password reset email';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

// Reset Password Request (Backend)
export async function resetPassword(req: Request, res: Response): Promise<void> {
    const { password } = req.body;
    const token = req.cookies.resetToken;

    try {
        if (!password) {
            res.status(400).json({ message: 'Password can not be blank' });
            return;
        }

        if (!token) {
            res.status(400).json({ message: 'Reset token is missing' });
            return;
        }

        // Hash the token to compare with the stored token in the DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Users.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
        });

        if (!user) {
            res.clearCookie('resetToken');

            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Users.findOneAndUpdate(
            { _id: user._id },
            {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        );

        res.clearCookie('resetToken');
        res.status(200).json({ message: 'Password successfully reset' });
    } catch (err: unknown) {
        const customMessage = 'Error sending password reset email';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

export async function verify(req: Request, res: Response): Promise<void> {
    const accessToken = req.cookies?.accessToken;

    try {
        if (!accessToken) {
            res.status(401).json({ message: 'No access token found' });
            return;
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { id: string; role: string };

        if (!decoded?.id) {
            res.status(403).json({ message: 'Invalid access token' });
            res.clearCookie('accessToken');
            return;
        }

        const user = await Users.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            res.clearCookie('accessToken');
            return;
        }

        // Generate a new access token
        const newAccessToken = createAccessToken(user._id.toString(), user.role);

        const accessTokenMaxAge = 1 * 60 * 1000; // 15 minutes
        const accessTokenCookieOptions = cookieOptions(accessTokenMaxAge);
        res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

        res.status(200).json({ message: 'User verified' });
    } catch (err: unknown) {
        const customMessage = 'Error verifying the user';
        catchErrorHandler(err, customMessage);
        res.clearCookie('accessToken');
        res.status(500).json({ message: customMessage, error: err });
    }
}

export async function verify2fa(req: Request, res: Response): Promise<void> {
    const { code } = req.body;
    const user = req.user as UsersDocument;

    try {
        if (!code) {
            res.status(400).json({ message: 'Code cannot be empty' });
            return;
        }

        if (!user.authentication.secret) {
            res.status(401).json({ message: 'No secret was found' });
            return;
        }

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const verified = speakeasy.totp.verify({
            secret: user.authentication.secret,
            encoding: 'base32',
            token: code,
        });

        if (!verified) {
            res.status(401).json({ message: 'Invalid 2FA code' });
            return;
        }

        const userRoleTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const userRoleTokenCookieOptions = cookieOptions(userRoleTokenMaxAge);

        res.cookie('userRole', user.role, userRoleTokenCookieOptions);
        res.status(200).json({ message: 'User authenticated' });
        return;
    } catch (err: unknown) {
        const customMessage = 'Error verifying 2FA';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

export async function toggle2fa(req: Request, res: Response): Promise<void> {
    const user = req.user as UsersDocument;
    const { is2faEnabled, isGoogleAuthEnabled } = req.body;

    try {
        const findUser = await Users.findOneAndUpdate(
            { _id: user.id },
            { 'authentication.enabled': is2faEnabled },
            { new: true },
        );

        if (!findUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!is2faEnabled) {
            res.status(200).json({ message: '2fa has been disabled' });
            return;
        }

        const { methods } = findUser.authentication;

        console.log(methods, 'FUCK YOU');

        if (isGoogleAuthEnabled && !methods.authenticator) {
            const secret = speakeasy.generateSecret({ name: 'Globe Scout' });

            if (!secret.otpauth_url) {
                res.status(500).json({ message: 'Error generating QR code URL.' });
                return;
            }

            // Generate the QR code URL for the user
            const qrCodeUrl = secret.otpauth_url;

            // Generate the QR code as an image using async/await
            const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

            if (!qrCodeImage) {
                res.status(500).json({ message: 'Error generating QR code image.' });
                return;
            }

            // Send the QR code to the user's email using the sendMail utility
            const to = user.email;
            const subject = 'Your 2FA Setup QR Code';
            const html = `<p>Scan this QR code with your authentication app (Google Authenticator, Microsoft Authenticator, etc.) to enable 2FA:</p><img src="cid:qr-code-image" />`;

            await sendMail(to, subject, html, qrCodeImage);

            await Users.findOneAndUpdate(
                { _id: user.id },
                { 'authentication.methods.authenticator': is2faEnabled, 'authentication.secret': secret.base32 },
                { new: true },
            );

            res.status(200).json({ message: 'QR code sent to your email. Please scan it to enable authenticator' });
            return;
        }

        res.status(200).json({ message: '2fa has been enabled' });
    } catch (err: unknown) {
        const customMessage = 'Error toggling 2FA';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

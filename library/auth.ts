import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import UsersModel from '../models/users/Users';
import { createAccessToken, createRefreshToken, createResetToken } from '../utils/authUtils';
import { cookieOptions } from '../utils/helpers/authHelpers';
import { sendMail } from '../utils/nodemailer';
import { catchErrorHandler } from '../utils/errorHandlers';

const JWT_SECRET = process.env.JWT_SECRET || '';

dayjs.extend(utc);

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

        const user = await UsersModel.findOne({ email });

        if (user) {
            res.status(409).json({ message: `User with email ${user.email} already exists` });
            return;
        }

        const newUser = new UsersModel({ email, password });

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

        const lastLogin = dayjs.utc().format('MM/DD/YYYY h:mm A');
        const user = await UsersModel.findOneAndUpdate(
            { email },
            { lastLogin: lastLogin, active: true },
            { new: true },
        );
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
            res.status(200).json({ message: 'Login successful, redirecting to 2FA' });
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

        const updatedUser = await UsersModel.findOneAndUpdate({ _id: decoded.id }, { active: false }, { new: true });

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

        const user = await UsersModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { resetToken, hashedToken } = createResetToken();
        const resetTokenExpiration = Date.now() + 15 * 60 * 1000; // set expiration (15 mins)

        const updateResult = await UsersModel.findOneAndUpdate(
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

        const resetUrl = `${process.env.BASE_URL}/reset-password`;

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

        const user = await UsersModel.findOne({
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

        await UsersModel.findOneAndUpdate(
            { _id: user._id },
            {
                password: hashedPassword,
                $unset: { resetPasswordToken: '', resetPasswordExpires: '' },
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
            res.clearCookie('refreshToken');
            res.clearCookie('userRole');
            return;
        }

        const user = await UsersModel.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.clearCookie('userRole');
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
        res.clearCookie('refreshToken');
        res.clearCookie('userRole');
        res.status(500).json({ message: customMessage, error: err });
    }
}

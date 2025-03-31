import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import Users, { UsersDocument } from '../models/users/Users';
import { cookieOptions } from '../utils/helpers/authHelpers';
import { sendMail } from '../utils/nodemailer';
import { catchErrorHandler } from '../utils/errorHandlers';

export async function toggle2fa(req: Request, res: Response): Promise<void> {
    const user = req.user as UsersDocument;
    const { is2faEnabled } = req.body;

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
            res.status(200).json({ message: '2FA has been disabled' });
            return;
        }

        res.status(200).json({ message: '2FA has been enabled' });
    } catch (err: unknown) {
        const customMessage = 'Error toggling 2FA';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

export async function toggle2faMethod(req: Request, res: Response): Promise<void> {
    const user = req.user as UsersDocument;
    const { isGoogleAuthEnabled } = req.body;

    try {
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { enabled, methods } = user.authentication;

        if (!enabled) {
            res.status(401).json({ message: '2FA is disabled' });
            return;
        }

        async function update2FAMethod(method: string, isEnabled: boolean) {
            const updateData: Record<string, boolean | null> = { [`authentication.methods.${method}`]: isEnabled };

            // Only update the secret for authenticator method
            if (method === 'authenticator' && !isEnabled) {
                updateData['authentication.secret'] = null;
            }

            return await Users.findOneAndUpdate({ _id: user.id }, { $set: updateData }, { new: true });
        }

        async function generateAndSendQRCode() {
            const secret = speakeasy.generateSecret({ name: 'Globe Scout' });

            if (!secret.otpauth_url) {
                res.status(500).json({ message: 'Error generating QR code URL.' });
                return;
            }

            const qrCodeUrl = secret.otpauth_url;

            const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

            if (!qrCodeImage) {
                res.status(500).json({ message: 'Error generating QR code image.' });
                return;
            }

            const to = user.email;
            const subject = 'Your 2FA Setup QR Code';
            const html = `<p>Scan this QR code with your authentication app (Google Authenticator, Microsoft Authenticator, etc.) to enable 2FA:</p><img src="cid:qr-code-image" />`;

            await Users.findOneAndUpdate(
                { email: user.email },
                { 'authentication.secret': secret.base32 },
                { new: true },
            );

            await sendMail(to, subject, html, qrCodeImage);
        }

        if (isGoogleAuthEnabled && !methods.authenticator) {
            await generateAndSendQRCode();

            await update2FAMethod('authenticator', true);

            res.status(200).json({ message: 'QR code sent to your email. Please scan it to enable authenticator' });
            return;
        }

        // Disable Google Authenticator method
        if (!isGoogleAuthEnabled && methods.authenticator) {
            await update2FAMethod('authenticator', false);

            res.status(200).json({ message: 'Google Authenticator has been disabled.' });
            return;
        }
    } catch (err: unknown) {
        const customMessage = 'Error toggling 2FA';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: customMessage, error: err });
    }
}

export async function validate2fa(req: Request, res: Response): Promise<void> {
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

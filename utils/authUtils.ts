import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Users from '../models/users/Users';
import { catchErrorHandler } from './errorHandlers';

// JWT_SECRET must always be a string
const JWT_SECRET: string = process.env.JWT_SECRET || '';
const JWT_ACCESS_EXPIRATION = '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRATION = '7d'; // 7 days for refresh token

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}

export function createAccessToken(userId: string, role: string): string {
    try {
        return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
    } catch (err: unknown) {
        const customMessage = 'createAccessToken: Error creating access token';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export function createRefreshToken(userId: string, role: string): string {
    try {
        return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
    } catch (err: unknown) {
        const customMessage = 'createRefreshToken: Error creating refresh token';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export function createResetToken() {
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // Hash for DB storage
        return { resetToken, hashedToken };
    } catch (err: unknown) {
        const customMessage = 'createResetToken: Error creating reset token';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function refreshAccessToken(req: Request): Promise<string | void> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        console.error('Refresh token missing');
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; role: string };

        if (!decoded) {
            console.error('Invalid refresh token');
            return;
        }

        const user = await Users.findById(decoded.id);
        if (!user) {
            console.error('User not found');
            return;
        }

        const newToken = createAccessToken(user._id.toString(), user.role);
        return newToken;
    } catch (err: unknown) {
        const customMessage = 'refreshAccessToken: Error creating new access token';
        catchErrorHandler(err, customMessage);

        return;
    }
}

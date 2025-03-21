import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users/Users';
import { catchErrorHandler } from '../utils/errorHandlers';

interface AuthenticatedRequest extends Request {
    user?: typeof User;
}

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

// 🔥 Generate Refresh Token (Long-lived)
export function createRefreshToken(userId: string, role: string): string {
    try {
        return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
    } catch (err: unknown) {
        const customMessage = 'createRefreshToken: Error creating refresh token';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

// Middleware: Authenticate JWT
export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!user.active) {
            res.status(403).json({ message: 'User is not active or does not exist' });
            return;
        }

        req.user = user;
        next();
    } catch (err: unknown) {
        const customMessage = 'authenticateJWT: Error authenticating token';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
        return;
    }
}

// Middleware: Refresh Access Token
export async function refreshAccessToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token missing or invalid' });
        return;
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string; role: string };
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const newAccessToken = createAccessToken(user._id.toString(), user.role);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err: unknown) {
        const customMessage = 'refreshAccessToken: Error creating new access token';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
        return;
    }
}

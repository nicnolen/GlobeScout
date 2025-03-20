import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users/Users';

interface AuthenticatedRequest extends Request {
    user?: typeof User;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRATION = '15m'; // 15 minutes for access token
const JWT_REFRESH_EXPIRATION = '7d'; // 7 days for refresh token

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}

export const createAccessToken = (userId: string, role: string) => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });
};

// 🔥 Generate Refresh Token (Long-lived)
export const createRefreshToken = (userId: string, role: string) => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
};

// Middleware: Authenticate JWT
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        const user = await User.findById(decoded.id);

        if (!user || !user.active) {
            return res.status(403).json({ message: 'User is not active or does not exist' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Middleware: Refresh Access Token
export const refreshAccessToken = async (req: Request, res: Response) => {
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
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

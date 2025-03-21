import { Request, Response } from 'express';
import Users from '../models/users/Users';
import { createAccessToken, createRefreshToken } from '../utils/auth';
import { catchErrorHandler } from '../utils/errorHandlers';

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
        const customMessage = 'Register Route: Error registering user';
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

        const user = await Users.findOneAndUpdate({ email }, { lastLogin: new Date() }, { new: true });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await user.comparePasswords(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = createAccessToken(user._id.toString(), user.role);
        const refreshToken = createRefreshToken(user._id.toString(), user.role);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (err: unknown) {
        const customMessage = 'Register Route: Error registering user';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
    }
}

// Logout User
export async function logout(req: Request, res: Response): Promise<void> {
    try {
        // Check if refreshToken cookie exists
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(400).json({ message: 'User is not logged in.' });
            return;
        }

        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err: unknown) {
        const customMessage = 'Logout Route: Error during logout';
        catchErrorHandler(err, customMessage);

        res.status(500).json({ message: customMessage, error: err });
    }
}

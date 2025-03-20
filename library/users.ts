import { Request, Response } from 'express';
import Users from '../models/users/Users';
import { createAccessToken, createRefreshToken } from '../utils/auth';

// Register User
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json('No email address provided');
            return;
        }

        if (!password) {
            res.status(400).json('No password provided');
            return;
        }

        const newUser = new Users({ email, password });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user || !(await user.comparePasswords(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        user.lastLogin = new Date();
        await user.save();

        const accessToken = createAccessToken(user._id.toString(), user.role);
        const refreshToken = createRefreshToken(user._id.toString(), user.role);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Login successful', accessToken });
    } catch (err) {
        console.log(err, 'err');
        res.status(500).json({ message: 'Error logging in', error: err });
    }
};

// Logout User
export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logout successful' });
};

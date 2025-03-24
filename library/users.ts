import { Request, Response } from 'express';
import { UsersDocument } from '../models/users/Users';

// Function to handle user status check
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
    const user = req.user as UsersDocument; // Cast req.user to UsersDocument

    if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    if (user.active === false) {
        res.status(403).json({ message: 'User account is inactive' });
        return;
    }

    const { password, __v, _id, ...cleanedUser } = user.toObject();

    // If the user is authenticated and active, return a success response
    res.status(200).json({ message: 'User is active and authenticated', user: cleanedUser });
    return;
}

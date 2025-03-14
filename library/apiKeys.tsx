import { Request, Response } from 'express';
import { catchErrorHandler } from '../utils/errorHandlers';

export function getGoogleMapsApiKey(req: Request, res: Response): void {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            res.status(401).json({ message: 'Google Maps API key is missing' });
            return;
        }

        res.status(200).json({ apiKey });
        return;
    } catch (err: unknown) {
        const customMessage = 'Error starting server';
        catchErrorHandler(err, customMessage);
        res.status(500).json({ message: 'An error occurred while retrieving the Google Maps API key' });
        return;
    }
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { catchErrorHandler } from '../../utils/errorHandlers';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI as string;

// Track connection status to reuse the connection on subsequent invocations
let isConnected: boolean = false;

export default async function connectToMongoDB(): Promise<void> {
    try {
        if (isConnected) {
            console.info('MongoDB connection already established');
            return; // Return early if already connected
        }

        // Establish a new connection if not already connected
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.info('MongoDB connected');
    } catch (err: unknown) {
        const customMessage = 'Error connecting to MongoDB';
        catchErrorHandler(err, customMessage);

        process.exit(1);
    }
}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { catchErrorHandler } from '../../utils/errorHandlers';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI as string;

export default async function connectToMongoDB(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.info('MongoDB connected');
    } catch (err: unknown) {
        const customMessage = 'Error connecting to MongoDB';
        catchErrorHandler(err, customMessage);

        process.exit(1);
    }
}

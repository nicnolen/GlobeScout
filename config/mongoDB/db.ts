import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from '../../utils/errorHandler';

dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI as string;

export default async function connectToMongoDB(): Promise<void> {
    try {
        await mongoose.connect(MONGODB_URI);
        console.info('MongoDB connected');
    } catch (err: unknown) {
        const customMessage = 'Error connecting to MongoDB';
        errorHandler(err, customMessage);

        process.exit(1);
    }
}

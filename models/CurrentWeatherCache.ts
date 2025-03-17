import mongoose, { Document, Schema } from 'mongoose';
import { CurrentWeatherResponse, Units } from '../types/weather';

interface CurrentWeatherCacheDocument extends Document {
    location: string;
    country: string;
    units: Units;
    currentWeather: CurrentWeatherResponse;
}

const CurrentWeatherCacheSchema = new Schema<CurrentWeatherCacheDocument>(
    {
        location: { type: String, required: true },
        country: { type: String, required: true },
        units: { type: String, required: true },
        currentWeather: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true },
);

// Clear every 30 minutes using Mongoose TTL
CurrentWeatherCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

// Use the model name from environment variable, defaulting to 'CurrentWeather'
const modelName = process.env.CURRENT_WEATHER_CACHE_MODEL_NAME;

if (!modelName) {
    throw new Error('CURRENT_WEATHER_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] ||
    mongoose.model<CurrentWeatherCacheDocument>(modelName, CurrentWeatherCacheSchema, modelName);

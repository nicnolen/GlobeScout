import mongoose, { Document, Schema } from 'mongoose';
import { CurrentWeatherResponse, Units } from '../types/weather';

interface CurrentWeatherDocument extends Document {
    city: string;
    country: string;
    units: Units;
    data: CurrentWeatherResponse;
}

const CurrentWeatherSchema = new Schema<CurrentWeatherDocument>(
    {
        city: { type: String, required: true },
        country: { type: String, required: true },
        units: { type: String, required: true },
        data: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true },
);

// Use the model name from environment variable, defaulting to 'CurrentWeather'
const modelName = process.env.CURRENT_WEATHER_CACHE_MODEL_NAME;

if (!modelName) {
    throw new Error('CURRENT_WEATHER_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] ||
    mongoose.model<CurrentWeatherDocument>(modelName, CurrentWeatherSchema, modelName);

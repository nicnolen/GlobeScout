import mongoose, { Schema, Document } from 'mongoose';
import { FiveDayForecastResponse, Units } from '../types/weather';

interface FiveDayForecastCacheDocument extends Document {
    city: string;
    country: string;
    units: Units;
    fiveDayForecast: FiveDayForecastResponse;
}

const FiveDayForecastCacheSchema = new Schema<FiveDayForecastCacheDocument>(
    {
        city: { type: String, required: true },
        country: { type: String, required: true },
        units: { type: String, required: true },
        fiveDayForecast: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true },
);

const modelName = process.env.FIVE_DAY_FORECAST_CACHE_MODEL_NAME;

if (!modelName) {
    throw new Error('FIVE_DAY_FORECAST_CACHE_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] ||
    mongoose.model<FiveDayForecastCacheDocument>(modelName, FiveDayForecastCacheSchema, modelName);

import mongoose, { Schema, Document } from 'mongoose';
import { TopTenPlacesResponse } from '../types/googleMaps';

interface TopTenPlacesCacheDocument extends Document {
    location: string;
    topTenPlaces: TopTenPlacesResponse;
}

const TopTenPlacesCacheSchema = new Schema<TopTenPlacesCacheDocument>(
    {
        location: { type: String, required: true },
        topTenPlaces: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true },
);

const modelName = process.env.TOP_TEN_PLACES_CACHE_MODEL_NAME;

if (!modelName) {
    throw new Error('TOP_TEN_PLACES_CACHE_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] ||
    mongoose.model<TopTenPlacesCacheDocument>(modelName, TopTenPlacesCacheSchema, modelName);

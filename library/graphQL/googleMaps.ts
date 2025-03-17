import axios from 'axios';
import dotenv from 'dotenv';
import { Place } from '../../types/googleMaps';
import TopTenPlacesModel from '../../models/TopTenPlacesCache';
import { catchErrorHandler } from '../../utils/errorHandlers';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps Error: Google Maps API key is missing.');
}

interface TopTenPlacesParams {
    locationSearch: string;
}

// Resolver function for fetching top-rated places
export async function getTopTenPlaces({ locationSearch }: TopTenPlacesParams): Promise<Place> {
    try {
        const cachedTopTenPlaces = await TopTenPlacesModel.findOne({ location: locationSearch });

        if (cachedTopTenPlaces) {
            console.info('Cached top ten places data was found');
            return cachedTopTenPlaces.topTenPlaces;
        }

        const GOOGLE_MAPS_TEXT_SEARCH_URL = process.env.GOOGLE_MAPS_TEXT_SEARCH_URL;

        if (!GOOGLE_MAPS_TEXT_SEARCH_URL) {
            throw new Error('Google Maps Text Search Error: Base URL is missing.');
        }

        // Create the dynamic query for Google Places API
        const textQuery = `Top rated places in ${locationSearch}`;

        // Send request to Google Places API
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(textQuery)}&language=en&key=${GOOGLE_MAPS_API_KEY}`,
        );

        // Process the response and format the data
        const sortedPlaces = response.data.results
            .filter((place: any) => place.rating) // Ensure there's a rating
            .sort((a: any, b: any) => b.rating - a.rating) // Sort by rating
            .slice(0, 10) // Take top 10
            .map((place: any) => ({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                coordinates: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                },
                priceLevel: place.price_level,
                userRatingsTotal: place.user_ratings_total,
            }));

        await TopTenPlacesModel.insertOne({
            location: locationSearch,
            topTenPlaces: sortedPlaces,
        });

        return sortedPlaces;
    } catch (err: unknown) {
        const customMessage = 'Error fetching places from Google Maps text search';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

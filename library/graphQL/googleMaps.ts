import axios from 'axios';
import dotenv from 'dotenv';
import { PlaceProps, PlaceResponse } from '../../types/googleMaps';
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
export async function getTopTenPlaces({ locationSearch }: TopTenPlacesParams): Promise<PlaceProps[]> {
    try {
        if (!locationSearch) {
            throw new Error('getTopTenPlaces Error: locationSearch can not be empty');
        }

        const sanitizedLocation = locationSearch.trim().toLowerCase();

        const cachedTopTenPlaces = await TopTenPlacesModel.findOne({ location: sanitizedLocation });

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
        const response = await axios.post(
            GOOGLE_MAPS_TEXT_SEARCH_URL,
            { textQuery },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                    'X-Goog-FieldMask':
                        'places.displayName,places.formattedAddress,places.rating,places.location,places.priceLevel,places.userRatingCount,places.websiteUri,places.businessStatus,places.nationalPhoneNumber',
                },
            },
        );

        // Process the response and format the data
        const sortedPlaces = response.data.places
            .filter((place: PlaceResponse) => place.rating) // Ensure there's a rating
            .sort((a: PlaceResponse, b: PlaceResponse) => b.rating - a.rating) // Sort by rating
            .slice(0, 10) // Take top 10
            .map((place: PlaceResponse) => ({
                name: place.displayName?.text || 'Unknown',
                address: place.formattedAddress,
                rating: place.rating,
                coordinates: place.location ? { lat: place.location.latitude, lng: place.location.longitude } : null,
                priceLevel: place.priceLevel,
                userRatingCount: place.userRatingCount,
                websiteUri: place.websiteUri,
                businessStatus: place.businessStatus,
                nationalPhoneNumber: place.nationalPhoneNumber,
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

import axios from 'axios';
import dotenv from 'dotenv';
import { PlaceProps, PlaceResponse } from '../../types/googleMaps';
import { checkOpenNowStatus } from '../../utils/checkOpenNowStatus';
import TopTenPlacesCacheModel from '../../models/caches/TopTenPlacesCache';
import { catchErrorHandler } from '../../utils/errorHandlers';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps Error: Google Maps API key is missing.');
}

interface TopTenPlacesParams {
    locationSearch: string;
}

enum BusinessStatus {
    Operational = 'OPERATIONAL',
    ClosedTemporarily = 'CLOSED_TEMPORARILY',
    ClosedPermanently = 'CLOSED_PERMANENTLY',
    Unspecified = 'BUSINESS_STATUS_UNSPECIFIED',
}

enum ParkingOptions {
    freeParkingLot = 'Free Parking Lot',
    paidParkingLot = 'Paid Parking Lot',
    freeStreetParking = 'Free Street Parking',
    paidStreetParking = 'Paid Street Parking',
    valetParking = 'Valet Parking',
    freeGarageParking = 'Free Garage Parking',
    paidGarageParking = 'Paid Garage Parking',
}

/* QUERY RESOLVER FUNCTIONS */

// Resolver function for fetching top-rated places
export async function getTopTenPlaces({ locationSearch }: TopTenPlacesParams): Promise<PlaceProps[]> {
    try {
        if (!locationSearch) {
            throw new Error('getTopTenPlaces Error: locationSearch can not be empty');
        }

        const sanitizedLocation = locationSearch.trim().replace(/\s+/g, ' ').toLowerCase();
        // Capitalize first letter of each word for display
        const displayLocation = sanitizedLocation.replace(/\b\w/g, (char) => char.toUpperCase());

        const cachedTopTenPlaces = await TopTenPlacesCacheModel.findOne({ location: displayLocation });

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
                        'places.displayName,places.formattedAddress,places.generativeSummary,places.primaryTypeDisplayName,places.rating,places.location,places.priceLevel,places.userRatingCount,places.websiteUri,places.businessStatus,places.nationalPhoneNumber,places.regularOpeningHours,places.timeZone,places.parkingOptions',
                },
            },
        );

        // Process the response and format the data
        const sortedPlaces = response.data.places
            .filter((place: PlaceResponse) => place.rating)
            .sort((a: PlaceResponse, b: PlaceResponse) => b.rating - a.rating)
            .slice(0, 10) // Take top 10
            .map((place: PlaceResponse) => {
                // Convert openNow boolean to a more descriptive string
                const openNow = checkOpenNowStatus(place as unknown as PlaceProps);

                const businessStatusMap: Record<BusinessStatus, string> = {
                    [BusinessStatus.Unspecified]: 'Unknown',
                    [BusinessStatus.Operational]: 'Operational',
                    [BusinessStatus.ClosedTemporarily]: 'Temporarily Closed',
                    [BusinessStatus.ClosedPermanently]: 'Permanently Closed',
                };

                const parkingOptionsMap: Record<ParkingOptions, string> = {
                    [ParkingOptions.freeParkingLot]: 'Free parking lot',
                    [ParkingOptions.paidParkingLot]: 'Paid parking lot',
                    [ParkingOptions.freeStreetParking]: 'Free street parking',
                    [ParkingOptions.paidStreetParking]: 'Paid street parking',
                    [ParkingOptions.valetParking]: 'Valet parking',
                    [ParkingOptions.freeGarageParking]: 'Free garage parking',
                    [ParkingOptions.paidGarageParking]: 'Paid garage parking',
                };

                const businessStatus = businessStatusMap[place.businessStatus as BusinessStatus];

                // Dynamically build the parking string based on parking options
                const parking =
                    parkingOptionsMap[place.parkingOptions as unknown as ParkingOptions] ||
                    'No parking information available';

                return {
                    name: place.displayName?.text || 'Unknown',
                    address: place.formattedAddress,
                    description: place.generativeSummary?.description?.text || 'No description available',
                    primaryType: place?.primaryTypeDisplayName?.text,
                    rating: place.rating,
                    coordinates: place.location
                        ? { lat: place.location.latitude, lng: place.location.longitude }
                        : null,
                    priceLevel: place.priceLevel,
                    userRatingCount: place.userRatingCount,
                    websiteUri: place.websiteUri,
                    businessStatus,
                    nationalPhoneNumber: place.nationalPhoneNumber,
                    regularOpeningHours: {
                        weekdayDescriptions: place.regularOpeningHours?.weekdayDescriptions,
                        openNow,
                    },
                    timeZone: {
                        id: place.timeZone.id,
                        version: place.timeZone?.version,
                    },
                    parking,
                };
            });

        await TopTenPlacesCacheModel.insertOne({
            location: displayLocation,
            topTenPlaces: sortedPlaces,
        });

        return sortedPlaces;
    } catch (err: unknown) {
        const customMessage = 'Error fetching places from Google Maps text search';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

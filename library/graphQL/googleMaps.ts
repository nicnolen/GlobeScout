import axios from 'axios';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';
import { PlaceProps, PlaceResponse } from '../../types/googleMaps';
import { UserData } from '../../types/users';
import { checkOpenNowStatus } from '../../utils/checkOpenNowStatus';
import TopTenPlacesCacheModel from '../../models/caches/TopTenPlacesCache';
import { incrementRequestCount } from '../../utils/helpers/rateLimitHelpers';
import { formatLocation } from '../../utils/helpers/helpers';
import { catchErrorHandler } from '../../utils/errorHandlers';

dotenv.config();

interface TopTenPlacesParams {
    locationSearch: string;
    googleMapsApiKey: string | null;
    googleMapsTextSearchUrl: string | null;
    user: UserData | null;
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
export async function getTopTenPlaces({
    locationSearch,
    googleMapsApiKey,
    googleMapsTextSearchUrl,
    user,
}: TopTenPlacesParams): Promise<PlaceProps[]> {
    try {
        if (!user) {
            throw new GraphQLError('No valid user was found.');
        }

        if (!googleMapsApiKey) {
            throw new GraphQLError('Google Maps Error: Google Maps API key is missing.');
        }

        if (!googleMapsTextSearchUrl) {
            throw new GraphQLError('Google Maps Error: Google Maps text search URL is missing.');
        }

        if (!locationSearch) {
            throw new GraphQLError('Location is required, please provide a valid city or country.');
        }

        const displayLocation = formatLocation(locationSearch);

        const cachedTopTenPlaces = await TopTenPlacesCacheModel.findOne({ location: displayLocation });

        if (cachedTopTenPlaces) {
            console.info('Cached top ten places data was found');
            return cachedTopTenPlaces.topTenPlaces;
        }

        await incrementRequestCount(user.email, 'googleMapsApi');

        // Create the dynamic query for Google Places API
        const textQuery = `Top rated places in ${locationSearch}`;

        // Send request to Google Places API
        const response = await axios.post(
            googleMapsTextSearchUrl,
            { textQuery },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': googleMapsApiKey,
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
        const finalMessage = catchErrorHandler(err, customMessage);
        throw new GraphQLError(finalMessage);
    }
}

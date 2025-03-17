import { getTopTenPlaces } from '../../library/graphQL/googleMaps';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface GetTopTenPlacesArgs {
    locationSearch: string;
}

export const placeResolvers = {
    Query: {
        getTopTenPlaces: async (parent: any, { locationSearch }: GetTopTenPlacesArgs) => {
            try {
                return await getTopTenPlaces({ locationSearch });
            } catch (err: unknown) {
                const customMessage = 'Error fetching top ten locations from Google Maps';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

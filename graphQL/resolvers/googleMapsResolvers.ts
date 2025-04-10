import { GraphQLError } from 'graphql';
import { getTopTenPlaces } from '../../library/graphQL/googleMaps';
import { Context } from '../../types/graphQLContext';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface GetTopTenPlacesArgs {
    locationSearch: string;
}

export const placeResolvers = {
    Query: {
        getTopTenPlaces: async (_parent: unknown, { locationSearch }: GetTopTenPlacesArgs, context: Context) => {
            try {
                const googleMapsApiKey = context.apiKeys.googleMapsApiKey;
                const googleMapsTextSearchUrl = context.apiBaseUrls.googleMapsTextSearchUrl;
                const user = context.user;

                return await getTopTenPlaces({ locationSearch, googleMapsApiKey, googleMapsTextSearchUrl, user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching top ten locations from Google Maps';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
    },
};

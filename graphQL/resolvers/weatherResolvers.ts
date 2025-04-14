import { GraphQLError } from 'graphql';
import { Weather, FiveDayForecast, Units } from '../../types/weather';
import { Context } from '../../types/graphQLContext';
import { getCurrentWeather, getFiveDayForecast } from '../../library/graphQL/weather';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface GetWeatherArgs {
    locationSearch: string;
    units: Units;
}

// Alias
type GetCurrentWeatherArgs = GetWeatherArgs;
type GetFiveDayForecastArgs = GetWeatherArgs;

export const weatherResolvers = {
    Query: {
        getCurrentWeather: async (
            _parent: unknown,
            { locationSearch, units }: GetCurrentWeatherArgs,
            context: Context,
        ): Promise<Weather> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getCurrentWeather({ locationSearch, units, openWeatherApiKey, openWeatherUrl, user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching current weather data from OpenWeatherMap';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
        getFiveDayForecast: async (
            _parent: unknown,
            { locationSearch, units }: GetFiveDayForecastArgs,
            context: Context,
        ): Promise<FiveDayForecast> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getFiveDayForecast({ locationSearch, units, openWeatherApiKey, openWeatherUrl, user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching five day forecast data from OpenWeatherMap';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
    },
};

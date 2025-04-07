import { Units } from '../../types/weather';
import { Weather, FiveDayForecast } from '../../types/weather';
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
            context: any,
        ): Promise<Weather> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getCurrentWeather(locationSearch, units, openWeatherApiKey, openWeatherUrl, user);
            } catch (err: unknown) {
                const customMessage = 'Error fetching current weather data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        getFiveDayForecast: async (
            _parent: unknown,
            { locationSearch, units }: GetFiveDayForecastArgs,
            context: any,
        ): Promise<FiveDayForecast> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getFiveDayForecast({ locationSearch, units, openWeatherApiKey, openWeatherUrl, user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching five day forecast data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

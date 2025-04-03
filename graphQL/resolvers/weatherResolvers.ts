import { Units } from '../../types/weather';
import { Weather, FiveDayForecast } from '../../types/weather';
import { getCurrentWeather, getFiveDayForecast } from '../../library/graphQL/weather';
import { catchErrorHandler } from '../../utils/errorHandlers';

interface GetWeatherArgs {
    location: string;
    units: Units;
}

// Alias
type GetCurrentWeatherArgs = GetWeatherArgs;
type GetFiveDayForecastArgs = GetWeatherArgs;

export const weatherResolvers = {
    Query: {
        getCurrentWeather: async (
            _parent: unknown,
            { location, units }: GetCurrentWeatherArgs,
            context: any,
        ): Promise<Weather> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getCurrentWeather(location, units, openWeatherApiKey, openWeatherUrl, user);
            } catch (err: unknown) {
                const customMessage = 'Error fetching current weather data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        getFiveDayForecast: async (
            _parent: unknown,
            { location, units }: GetFiveDayForecastArgs,
            context: any,
        ): Promise<FiveDayForecast> => {
            try {
                const openWeatherApiKey = context.apiKeys.openWeatherApiKey;
                const openWeatherUrl = context.apiBaseUrls.openWeatherUrl;
                const user = context.user;

                return await getFiveDayForecast({ location, units, openWeatherApiKey, openWeatherUrl, user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching five day forecast data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

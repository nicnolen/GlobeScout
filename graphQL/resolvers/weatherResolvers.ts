import { Units } from '../../types/weather';
import { Weather, FiveDayForecast } from '../../types/weather';
import { getCurrentWeather, getFiveDayForecast } from '../../library/graphQL/weather';
import { catchErrorHandler } from '../../utils/errorHandlers';

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    throw new Error(
        'OpenWeatherMap Error: API Key is missing. Please set the OPENWEATHER_API_KEY environment variable.',
    );
}

interface GetWeatherArgs {
    location: string;
    units: Units;
}

// Alias
type GetCurrentWeatherArgs = GetWeatherArgs;
type GetFiveDayForecastArgs = GetWeatherArgs;

export const weatherResolvers = {
    Query: {
        getCurrentWeather: async (parent: any, { location, units }: GetCurrentWeatherArgs): Promise<Weather> => {
            try {
                return await getCurrentWeather(location, units);
            } catch (err: unknown) {
                const customMessage = 'Error fetching current weather data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        getFiveDayForecast: async (
            parent: any,
            { location, units }: GetFiveDayForecastArgs,
        ): Promise<FiveDayForecast> => {
            try {
                return await getFiveDayForecast(location, units);
            } catch (err: unknown) {
                const customMessage = 'Error fetching five day forecast data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

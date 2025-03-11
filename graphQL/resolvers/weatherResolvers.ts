import { CurrentWeather, GetCurrentWeatherArgs } from '../../types/weather';
import { getCurrentWeather } from '../../library/weather';
import { catchErrorHandler } from '../../utils/errorHandlers';

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    throw new Error(
        'OpenWeatherMap Error: API Key is missing. Please set the OPENWEATHER_API_KEY environment variable.',
    );
}

export const weatherResolvers = {
    Query: {
        getCurrentWeather: async (parent: any, { city, units }: GetCurrentWeatherArgs): Promise<CurrentWeather> => {
            try {
                return await getCurrentWeather(city, units);
            } catch (err: unknown) {
                const customMessage = 'Error fetching weather data from OpenWeatherMap';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

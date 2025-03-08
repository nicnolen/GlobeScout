import axios from 'axios';
import { Units, Weather, CurrentWeatherResponse } from '../../types/weather';
import { errorHandler } from '../../utils/errorHandler';

interface GetCurrentWeatherArgs {
    city: string;
    units: Units;
}

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    throw new Error(
        'OpenWeatherMap Error: API Key is missing. Please set the OPENWEATHER_API_KEY environment variable.',
    );
}

export const weatherResolvers = {
    Query: {
        getCurrentWeather: async (parent: any, { city, units }: GetCurrentWeatherArgs): Promise<Weather> => {
            try {
                const response = await axios.get<CurrentWeatherResponse>(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`,
                );
                const weatherData = response.data;
                console.log(weatherData, 'weatherData');

                return {
                    description: weatherData.weather[0].description,
                    icon: weatherData.weather[0].icon,
                    temperature: weatherData.main.temp,
                    minTemperature: weatherData.main.temp_min,
                    maxTemperature: weatherData.main.temp_max,
                    humidity: weatherData.main.humidity,
                    pressure: weatherData.main.pressure,
                    visibility: weatherData.visibility,
                    windSpeed: weatherData.wind.speed,
                    windDirection: weatherData.wind.deg,
                    sunrise: weatherData.sys.sunrise,
                    sunset: weatherData.sys.sunset,
                };
            } catch (err: unknown) {
                const customMessage = 'Error fetching weather data from OpenWeatherMap';
                errorHandler(err, customMessage);
                throw err;
            }
        },
    },
};

import axios from 'axios';
import {
    Weather,
    FiveDayForecast,
    DailyWeather,
    CurrentWeatherResponse,
    FiveDayForecastResponse,
    Units,
} from '../types/weather';
import CurrentWeatherModel from '../models/CurrentWeather';
import FiveDayForecastModel from '../models/FiveDayForecast';
import { catchErrorHandler } from '../utils/errorHandlers';

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;
const BASE_URL: string | undefined = process.env.OPENWEATHER_BASE_URL;

if (!API_KEY) {
    throw new Error('OpenWeatherMap Error: API Key is missing.');
}

if (!BASE_URL) {
    throw new Error('OpenWeatherMap Error: Base URL is missing.');
}

interface DailyForecastAccumulator {
    description: string;
    icon: string;
    temperatures: number[];
    humidity: number[];
    pressure: number[];
    visibility: number[];
    windSpeed: number[];
    minTemperature: number;
    maxTemperature: number;
}

export async function getCurrentWeather(city: string, units: Units): Promise<Weather> {
    try {
        // Check if the data is cached in MongoDB
        const cachedCurrentWeather = await CurrentWeatherModel.findOne({ city, units });

        if (cachedCurrentWeather) {
            console.info('Cached current weather data was found');
            return cachedCurrentWeather.currentWeather;
        }

        const response = await axios.get<CurrentWeatherResponse>(
            `${process.env.OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`,
        );

        const weatherData = response.data;

        const country = weatherData.sys.country;

        const fortmattedCurrentWeather = {
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            temperature: Math.round(weatherData.main.temp),
            minTemperature: Math.round(weatherData.main.temp_min),
            maxTemperature: Math.round(weatherData.main.temp_max),
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            visibility: weatherData.visibility,
            windSpeed: weatherData.wind.speed,
            windDirection: weatherData.wind.deg,
            sunrise: weatherData.sys.sunrise,
            sunset: weatherData.sys.sunset,
        };

        await CurrentWeatherModel.insertOne({
            city,
            country,
            units,
            currentWeather: fortmattedCurrentWeather,
        });

        return fortmattedCurrentWeather;
    } catch (err: unknown) {
        const customMessage = 'Error fetching five day forecast data from OpenWeatherMap';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function getFiveDayForecast(city: string, units: Units): Promise<FiveDayForecast> {
    try {
        // Check the cache first (MongoDB)
        const cachedFiveDayForecast = await FiveDayForecastModel.findOne({
            city,
            units,
        });

        if (cachedFiveDayForecast) {
            console.info('Cached five day forecast data was found');
            return cachedFiveDayForecast.fiveDayForecast;
        }

        // Fetch the 5-day forecast from OpenWeather API
        const response = await axios.get<FiveDayForecastResponse>(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`,
        );

        const { list } = response.data;
        const country = response.data.city.country;

        // Helper function to calculate average
        function average(arr: number[]): number {
            if (arr.length === 0) return 0; // Prevent division by zero
            return arr.reduce((acc, val) => acc + val, 0) / arr.length;
        }

        // Define an intermediate accumulator type to temporarily hold forecast data

        // Group the 3-hour forecast data into daily averages
        const dailyForecast = list.reduce<Record<string, DailyForecastAccumulator>>(
            (acc, entry) => {
                const date = new Date(entry.dt_txt).toISOString().split('T')[0]; // Extract the date

                // Initialize the day if it doesn't exist
                if (!acc[date]) {
                    acc[date] = {
                        description: entry.weather[0].description,
                        icon: entry.weather[0].icon,
                        temperatures: [],
                        humidity: [],
                        pressure: [],
                        visibility: [],
                        windSpeed: [],
                        minTemperature: entry.main.temp_min,
                        maxTemperature: entry.main.temp_max,
                    };
                }

                // Aggregate data
                acc[date].temperatures.push(entry.main.temp ?? 0);
                acc[date].humidity.push(entry.main.humidity ?? 0);
                acc[date].pressure.push(entry.main.pressure ?? 0);
                acc[date].visibility.push(entry.visibility ?? 0);
                acc[date].windSpeed.push(entry.wind.speed ?? 0);

                return acc;
            },
            {} as Record<string, DailyForecastAccumulator>, // Use the new accumulator type
        );

        // Convert daily data into an array with averages
        const formattedForecastEntries: DailyWeather[] = Object.keys(dailyForecast).map((date) => {
            const dayData = dailyForecast[date];
            return {
                date,
                description: dayData.description,
                icon: dayData.icon,
                temperature: Math.round(average(dayData.temperatures)),
                minTemperature: Math.round(dayData.minTemperature),
                maxTemperature: Math.round(dayData.maxTemperature),
                humidity: Math.round(average(dayData.humidity)),
                pressure: Math.round(average(dayData.pressure)),
                visibility: Math.round(average(dayData.visibility)),
                windSpeed: Math.round(average(dayData.windSpeed)),
            };
        });

        await FiveDayForecastModel.insertOne({
            city,
            country,
            units,
            fiveDayForecast: formattedForecastEntries,
        });

        // Return the forecast entries (Weather[])
        return formattedForecastEntries;
    } catch (error) {
        console.error(`Error fetching forecast for ${city}:`, error);
        throw new Error('Failed to fetch 5-day forecast.');
    }
}

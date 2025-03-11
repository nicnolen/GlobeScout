import axios from 'axios';
import {
    CurrentWeather,
    FiveDayForecast,
    CurrentWeatherResponse,
    FiveDayForecastResponse,
    Units,
} from '../types/weather';
import CurrentWeatherModel from '../models/CurrentWeather';
import { catchErrorHandler } from '../utils/errorHandlers';

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;
const BASE_URL: string | undefined = process.env.OPENWEATHER_BASE_URL;

if (!API_KEY) {
    throw new Error('OpenWeatherMap Error: API Key is missing.');
}

if (!BASE_URL) {
    throw new Error('OpenWeatherMap Error: Base URL is missing.');
}

export async function getCurrentWeather(city: string, units: Units): Promise<CurrentWeather> {
    try {
        // Check if the data is cached in MongoDB
        const cachedCurrentWeather = await CurrentWeatherModel.findOne({ city, units });

        if (cachedCurrentWeather) {
            console.info('Cached current weather data was found');
            return cachedCurrentWeather.data;
        }

        const response = await axios.get<CurrentWeatherResponse>(
            `${process.env.OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`,
        );

        const weatherData = response.data;

        const country = weatherData.sys.country;

        const fortmattedCurrentWeather = {
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

        await CurrentWeatherModel.insertOne({
            city,
            country,
            units,
            data: fortmattedCurrentWeather,
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
        // Fetch the 5-day forecast from OpenWeather API
        const response = await axios.get<FiveDayForecastResponse>(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`,
        );

        const { list } = response.data;

        // Map through the response list and transform it into an array of Weather objects
        const forecastEntries: FiveDayForecast = list.map((entry) => ({
            description: entry.weather[0].description,
            icon: entry.weather[0].icon,
            temperature: entry.main.temp,
            minTemperature: entry.main.temp_min,
            maxTemperature: entry.main.temp_max,
            humidity: entry.main.humidity,
            pressure: entry.main.pressure,
            visibility: entry.visibility,
            windSpeed: entry.wind.speed,
            windDirection: entry.wind.deg,
            timestamp: entry.dt,
            dateTime: entry.dt_txt,
            sunrise: entry.sunrise,
            sunset: entry.sunset,
        }));

        // Return the forecast entries (Weather[])
        return forecastEntries;
    } catch (error) {
        console.error(`Error fetching forecast for ${city}:`, error);
        throw new Error('Failed to fetch 5-day forecast.');
    }
}

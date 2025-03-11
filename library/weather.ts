import axios from 'axios';
import { CurrentWeather, CurrentWeatherResponse, Units } from '../types/weather';
import CurrentWeatherModel from '../models/CurrentWeather';

const API_KEY: string | undefined = process.env.OPENWEATHER_API_KEY;
const BASE_URL: string | undefined = process.env.OPENWEATHER_BASE_URL;

if (!API_KEY) {
    throw new Error('OpenWeatherMap Error: API Key is missing.');
}

if (!BASE_URL) {
    throw new Error('OpenWeatherMap Error: Base URL is missing.');
}

export async function getCurrentWeather(city: string, units: Units): Promise<CurrentWeather> {
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
}

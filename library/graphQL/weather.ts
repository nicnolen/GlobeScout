import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    Weather,
    FiveDayForecast,
    DailyWeather,
    CurrentWeatherResponse,
    FiveDayForecastResponse,
    Units,
} from '../../types/weather';
import CurrentWeatherModel from '../../models/CurrentWeatherCache';
import FiveDayForecastModel from '../../models/FiveDayForecastCache';
import { catchErrorHandler } from '../../utils/errorHandlers';

dayjs.extend(utc);

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

export async function getCurrentWeather(location: string, units: Units): Promise<Weather> {
    try {
        const cachedCurrentWeather = await CurrentWeatherModel.findOne({ location, units });

        if (cachedCurrentWeather) {
            console.info('Cached current weather data was found');
            return cachedCurrentWeather.currentWeather;
        }

        const response = await axios.get<CurrentWeatherResponse>(
            `${process.env.OPENWEATHER_BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=${units}`,
        );

        const { weather, main, wind, sys, visibility } = response.data;

        const country = sys.country;

        const metersToMiles = 0.000621371;
        const visibilityConversion = units === 'imperial' ? Math.round(visibility * metersToMiles) : visibility;

        const fortmattedCurrentWeather = {
            description: weather[0].description,
            icon: weather[0].icon,
            temperature: Math.round(main.temp),
            minTemperature: Math.round(main.temp_min),
            maxTemperature: Math.round(main.temp_max),
            humidity: main.humidity,
            pressure: main.pressure,
            visibility: visibilityConversion,
            windSpeed: wind.speed,
            windDirection: wind.deg,
            sunrise: sys.sunrise,
            sunset: sys.sunset,
        };

        await CurrentWeatherModel.insertOne({
            location,
            country,
            units,
            currentWeather: fortmattedCurrentWeather,
        });

        return fortmattedCurrentWeather;
    } catch (err: unknown) {
        const customMessage = 'Error fetching current weather data from OpenWeatherMap';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function getFiveDayForecast(location: string, units: Units): Promise<FiveDayForecast> {
    try {
        // Check the cache first (MongoDB)
        const cachedFiveDayForecast = await FiveDayForecastModel.findOne({
            location,
            units,
        });

        if (cachedFiveDayForecast) {
            console.info('Cached five day forecast data was found');
            return cachedFiveDayForecast.fiveDayForecast;
        }

        // Fetch the 5-day forecast from OpenWeather API
        const response = await axios.get<FiveDayForecastResponse>(
            `${BASE_URL}/forecast?q=${location}&appid=${API_KEY}&units=${units}`,
        );

        const { list } = response.data;
        const country = response.data.city.country;

        // Determine today's date
        const today = dayjs().format('dddd MM/DD/YYYY');

        // Filter out the current day's forecast data (skip all entries for today)
        const filteredList = list.filter((entry) => {
            const formattedDate = dayjs(entry.dt_txt).format('dddd MM/DD/YYYY');
            return formattedDate !== today;
        });

        // Helper function to calculate average
        function average(arr: number[]): number {
            if (arr.length === 0) return 0; // Prevent division by zero
            return arr.reduce((acc, val) => acc + val, 0) / arr.length;
        }

        // Group the 3-hour forecast data into daily averages
        const dailyForecast = filteredList.reduce<Record<string, DailyForecastAccumulator>>(
            (acc, entry) => {
                const date = new Date(entry.dt_txt);
                const formattedDate = dayjs(date).format('dddd MM/DD/YYYY');

                // Initialize the day if it doesn't exist
                if (!acc[formattedDate]) {
                    acc[formattedDate] = {
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
                if (entry.main.temp !== undefined && entry.main.temp !== null) {
                    acc[formattedDate].temperatures.push(entry.main.temp);
                }
                if (entry.main.humidity !== undefined && entry.main.humidity !== null) {
                    acc[formattedDate].humidity.push(entry.main.humidity);
                }
                if (entry.main.pressure !== undefined && entry.main.pressure !== null) {
                    acc[formattedDate].pressure.push(entry.main.pressure);
                }
                if (entry.visibility !== undefined && entry.visibility !== null) {
                    acc[formattedDate].visibility.push(entry.visibility);
                }
                if (entry.wind.speed !== undefined && entry.wind.speed !== null) {
                    acc[formattedDate].windSpeed.push(entry.wind.speed);
                }

                return acc;
            },
            {} as Record<string, DailyForecastAccumulator>, // Use the new accumulator type
        );

        // Convert daily data into an array with averages
        const formattedForecastEntries: DailyWeather[] = Object.keys(dailyForecast).map((date) => {
            const dayData = dailyForecast[date];

            const metersToMiles = 0.000621371;
            const visibilityConversion =
                units === 'imperial'
                    ? Math.round(average(dayData.visibility) * metersToMiles)
                    : Math.round(average(dayData.visibility));

            return {
                date,
                description: dayData.description,
                icon: dayData.icon,
                temperature: Math.round(average(dayData.temperatures)),
                minTemperature: Math.round(dayData.minTemperature),
                maxTemperature: Math.round(dayData.maxTemperature),
                humidity: Math.round(average(dayData.humidity)),
                pressure: Math.round(average(dayData.pressure)),
                visibility: visibilityConversion,
                windSpeed: Math.round(average(dayData.windSpeed)),
            };
        });

        await FiveDayForecastModel.insertOne({
            location,
            country,
            units,
            fiveDayForecast: formattedForecastEntries,
        });

        // Return the forecast entries (Weather[])
        return formattedForecastEntries;
    } catch (err: unknown) {
        const customMessage = 'Error fetching five day weather forecast from OpenWeatherMap';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

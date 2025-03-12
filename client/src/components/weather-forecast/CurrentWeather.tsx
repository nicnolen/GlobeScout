'use client';
import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Units } from '../../../../types/weather';
import { selectCurrentWeatherData } from '../../redux/selectors/weatherSelectors'; // Assuming you have this selector
import Tooltip from '../common/Tooltip';

interface CurrentWeatherProps {
    units: Units;
}

export default function CurrentWeather({ units }: CurrentWeatherProps): JSX.Element {
    const currentWeatherData = useSelector(selectCurrentWeatherData); // This should come from Redux

    if (!currentWeatherData) {
        return <p>Loading current weather...</p>;
    }

    const isUnitsCelcius = units === Units.Metric;
    const degreeDisplay = isUnitsCelcius ? '°C' : '°F';
    const visibilityDisplay = isUnitsCelcius ? 'm' : 'mi';
    const windSpeedDisplay = isUnitsCelcius ? 'm/s' : 'mph';

    const {
        description,
        icon,
        temperature,
        minTemperature,
        maxTemperature,
        humidity,
        pressure,
        visibility,
        windSpeed,
    } = currentWeatherData;

    const weatherIconTooltipMessage = description;

    return (
        <div className="rounded-lg shadow-lg border-2 border-gray-300 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Current Weather</h3>

            {/* Weather Card */}
            <div className="flex flex-col items-center justify-center mb-4">
                <Tooltip message={weatherIconTooltipMessage}>
                    <Image
                        src={`http://openweathermap.org/img/wn/${icon}.png`}
                        alt="Weather Icon"
                        width={60}
                        height={60}
                        className="mx-2"
                    />
                </Tooltip>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                    {temperature}° {/* Display temperature */}
                </p>
            </div>

            {/* Weather Details */}
            <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Min:</span> {minTemperature}
                    {degreeDisplay} / <span className="font-semibold">Max:</span> {maxTemperature}
                    {degreeDisplay}
                </p>
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Humidity:</span> {humidity}%
                </p>
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Pressure:</span> {pressure} hPa
                </p>
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Visibility:</span> {visibility} {visibilityDisplay}
                </p>
                <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold">Wind Speed:</span> {windSpeed} {windSpeedDisplay}
                </p>
            </div>
        </div>
    );
}

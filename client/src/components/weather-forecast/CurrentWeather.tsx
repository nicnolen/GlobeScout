'use client';
import React, { JSX } from 'react';
import Image from 'next/image';
import { Units, Weather } from '../../../../types/weather';
import Tooltip from '../common/Tooltip';

interface CurrentWeatherProps {
    units: Units;
    currentWeatherData: Weather | null;
}

export default function CurrentWeather({ units, currentWeatherData }: CurrentWeatherProps): JSX.Element {
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
        <div className="card p-6 mb-6 max-w-lg mx-auto">
            <h3 className="subtitle text-center">Current Weather</h3>

            <div className="flex items-center justify-between mb-6">
                {/* Weather Icon & Temperature */}
                <div className="flex items-center space-x-4">
                    <Tooltip message={weatherIconTooltipMessage}>
                        <Image
                            src={`http://openweathermap.org/img/wn/${icon}.png`}
                            alt="Weather Icon"
                            width={70}
                            height={70}
                            className="rounded-full"
                        />
                    </Tooltip>
                    <p className="text-4xl font-extrabold text-gray-800">
                        {temperature}
                        {degreeDisplay}
                    </p>
                </div>

                {/* Temperature Range */}
                <div className="text-center space-y-1">
                    <p className="text-lg text-gray-600">
                        <span className="font-semibold">Min:</span> {minTemperature}
                        {degreeDisplay} /<span className="font-semibold">Max:</span> {maxTemperature}
                        {degreeDisplay}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Additional Weather Details */}
                <div className="text-sm text-gray-600">
                    <p>
                        <span className="font-semibold">Humidity:</span> {humidity}%
                    </p>
                    <p>
                        <span className="font-semibold">Pressure:</span> {pressure} hPa
                    </p>
                </div>
                <div className="text-sm text-gray-600">
                    <p>
                        <span className="font-semibold">Visibility:</span> {visibility} {visibilityDisplay}
                    </p>
                    <p>
                        <span className="font-semibold">Wind Speed:</span> {windSpeed} {windSpeedDisplay}
                    </p>
                </div>
            </div>
        </div>
    );
}

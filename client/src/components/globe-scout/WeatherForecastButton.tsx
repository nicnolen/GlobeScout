'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Units } from '../../../../types/weather';
import { WeatherForecastButtonProps } from '../../../../types/weather';

export default function WeatherForecastButton({
    currentWeatherData,
    units,
    setUnits,
    loading,
    isError,
}: WeatherForecastButtonProps): JSX.Element {
    const router = useRouter();

    const handleWeatherButtonClick = () => {
        if (currentWeatherData) {
            router.push('/weather-forecast');
        }
    };

    const isUnitsCelcius = units === Units.Metric;
    const degreeDisplay = isUnitsCelcius ? '°C' : '°F';

    return (
        <>
            {/* Units buttons */}
            <button
                onClick={() => setUnits(Units.Metric)}
                className={`p-2 px-4 mr-2 rounded-md cursor-pointer border-none ${
                    units === Units.Metric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                }`}
            >
                Metric
            </button>
            <button
                onClick={() => setUnits(Units.Imperial)}
                className={`p-2 px-4 mr-2 rounded-md cursor-pointer border-none ${
                    units === Units.Imperial ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                }`}
            >
                Imperial
            </button>

            {/* Weather button with icon, maxTemp / minTemp */}
            <button
                type="button"
                onClick={handleWeatherButtonClick}
                disabled={loading || isError || !currentWeatherData}
                className="flex items-center ml-2.5 p-2 px-4 rounded-md bg-blue-600 text-white cursor-pointer border-none"
            >
                {currentWeatherData?.getCurrentWeather.icon && (
                    <Image
                        src={`https://openweathermap.org/img/wn/${currentWeatherData.getCurrentWeather.icon}@2x.png`}
                        alt="weather-icon"
                        width={30}
                        height={30}
                        className="mr-2.5"
                    />
                )}
                {currentWeatherData?.getCurrentWeather.maxTemperature}
                {degreeDisplay} / {currentWeatherData?.getCurrentWeather.minTemperature}
                {degreeDisplay}
            </button>
        </>
    );
}

'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Units } from '../../../../types/weather';

export default function WeatherForecastButton({ currentWeatherData, units, setUnits, loading, isError }): JSX.Element {
    const router = useRouter();

    const handleWeatherButtonClick = () => {
        if (currentWeatherData) {
            router.push('/weather-forecast');
        }
    };

    return (
        <>
            {/* Units buttons */}
            <button
                onClick={() => setUnits(Units.Metric)}
                style={{
                    padding: '8px 15px',
                    marginRight: '10px',
                    borderRadius: '5px',
                    backgroundColor: units === Units.Metric ? '#007bff' : '#f1f1f1',
                    color: units === Units.Metric ? '#fff' : '#000',
                    cursor: 'pointer',
                    border: 'none',
                }}
            >
                Metric
            </button>
            <button
                onClick={() => setUnits(Units.Imperial)}
                style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    backgroundColor: units === Units.Imperial ? '#007bff' : '#f1f1f1',
                    color: units === Units.Imperial ? '#fff' : '#000',
                    cursor: 'pointer',
                    border: 'none',
                }}
            >
                Imperial
            </button>

            {/* Weather button with icon, maxTemp / minTemp */}
            <button
                type="button"
                onClick={handleWeatherButtonClick}
                disabled={loading || isError || !currentWeatherData}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                    border: 'none',
                }}
            >
                {currentWeatherData?.getCurrentWeather.icon && (
                    <Image
                        src={`https://openweathermap.org/img/wn/${currentWeatherData.getCurrentWeather.icon}@2x.png`}
                        alt="weather-icon"
                        width={30}
                        height={30}
                        style={{ marginRight: '8px' }}
                    />
                )}
                {currentWeatherData?.getCurrentWeather.maxTemperature}° /
                {currentWeatherData?.getCurrentWeather.minTemperature}°
            </button>
        </>
    );
}

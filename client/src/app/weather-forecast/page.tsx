'use client';

import React, { JSX, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectLocation, selectUnits, selectCurrentWeatherData } from '../../redux/selectors/weatherSelectors';
import CurrentWeather from '../../components/weather-forecast/CurrentWeather';
import FiveDayForecast from '../../components/weather-forecast/FiveDayForecast';

export default function WeatherForecast(): JSX.Element {
    const location = useSelector(selectLocation);
    const units = useSelector(selectUnits);
    const currentWeatherData = useSelector(selectCurrentWeatherData);
    const router = useRouter();

    useEffect(() => {
        if (!currentWeatherData) {
            setTimeout(() => {
                router.push('/globe-scout');
            }, 2000);
        }
    }, [currentWeatherData]); // eslint-disable-line  react-hooks/exhaustive-deps

    if (!currentWeatherData) {
        return <p className="text-red-500">No weather forecast found. Redirecting to Globe Scout</p>;
    }

    return (
        <div className="p-4 w-full">
            <h2 className="pageTitle mb-3">Weather forecast for {location}</h2>
            <CurrentWeather units={units} currentWeatherData={currentWeatherData} />
            <FiveDayForecast location={location} units={units} />
        </div>
    );
}

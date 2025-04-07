'use client';

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectLocationSearch, selectUnits, selectCurrentWeatherData } from '../../redux/selectors/weatherSelectors';
import CurrentWeather from '../../components/weather-forecast/CurrentWeather';
import FiveDayForecast from '../../components/weather-forecast/FiveDayForecast';

export default function WeatherForecast(): JSX.Element {
    const locationSearch = useSelector(selectLocationSearch);
    const units = useSelector(selectUnits);
    const currentWeatherData = useSelector(selectCurrentWeatherData);
    const router = useRouter();

    if (!currentWeatherData) {
        setTimeout(() => {
            router.push('/globe-scout');
        }, 2000);

        return <p className="text-red-500">No weather forecast found. Redirecting to Globe Scout...</p>;
    }

    return (
        <div className="p-4 w-full">
            <h2 className="pageTitle mb-3">Weather forecast for {locationSearch}</h2>
            <CurrentWeather units={units} currentWeatherData={currentWeatherData} />
            <FiveDayForecast locationSearch={locationSearch} units={units} />
        </div>
    );
}

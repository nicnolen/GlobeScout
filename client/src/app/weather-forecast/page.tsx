'use client';

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { selectCity, selectUnits } from '../../redux/selectors/weatherSelectors';
import CurrentWeather from '../../components/weather-forecast/CurrentWeather';
import FiveDayForecast from '../../components/weather-forecast/FiveDayForecast';

export default function WeatherForecast(): JSX.Element {
    const city = useSelector(selectCity);
    const units = useSelector(selectUnits);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Weather forecast for {city}</h2>
            <CurrentWeather units={units} />
            <FiveDayForecast city={city} units={units} />
        </div>
    );
}

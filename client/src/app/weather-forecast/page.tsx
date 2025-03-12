'use client';

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { selectCity, selectUnits } from '../../redux/selectors/weatherSelectors';
import FiveDayForecast from '../../components/weather-forecast/fiveDayForecast';

export default function WeatherForecast(): JSX.Element {
    const city = useSelector(selectCity);
    const units = useSelector(selectUnits);

    return (
        <div className="p-4">
            {/* Weather Forecast Header */}
            <h2 className="text-xl font-bold mb-4">Weather forecast for {city}</h2>

            {/* Render FiveDayForecast Component */}
            <FiveDayForecast city={city} units={units} />
        </div>
    );
}

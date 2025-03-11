'use client';
import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { selectCity, selectUnits } from '../../redux/selectors/weatherSelectors';
import FiveDayForecast from '../../components/weather-forecast/fiveDayForecast';

export default function WeatherForecast(): JSX.Element {
    //TODO IMPORT WEATHER FORECAST PAGE AND ADD A BACK BUTTON
    const city = useSelector(selectCity);
    const units = useSelector(selectUnits);

    return <FiveDayForecast city={city} units={units} />;
}

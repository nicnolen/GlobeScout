'use client';

import React, { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Units, Weather } from '../../../../types/weather';
import { selectUnits } from '../../redux/selectors/weatherSelectors';
import { setUnits } from '../../redux/slices/weatherSlice';

export interface WeatherForecastButtonProps {
    currentWeatherData: Weather;
    isLoading: boolean;
    isError: ApolloError | null;
}

export default function WeatherForecastButton({
    currentWeatherData,
    isLoading,
    isError,
}: WeatherForecastButtonProps): JSX.Element {
    const router = useRouter();
    const units = useSelector(selectUnits);
    const dispatch = useDispatch();

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
                onClick={() => dispatch(setUnits(Units.Metric))}
                className={`p-2 px-4 mr-2 rounded-md cursor-pointer border-none ${
                    units === Units.Metric ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                }`}
            >
                Metric
            </button>
            <button
                onClick={() => dispatch(setUnits(Units.Imperial))}
                className={`p-2 px-4 mr-2 rounded-md cursor-pointer border-none ${
                    units === Units.Imperial ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                }`}
            >
                Imperial
            </button>

            {/* Weather button with icon and current temperature */}
            <button
                type="button"
                onClick={handleWeatherButtonClick}
                disabled={isLoading || !!isError || !currentWeatherData} // !!error will convert ApolloError to true and null to false
                className="flex items-center ml-2.5 p-2 px-4 rounded-md bg-blue-600 text-white cursor-pointer border-none"
            >
                {currentWeatherData.icon && (
                    <Image
                        src={`https://openweathermap.org/img/wn/${currentWeatherData.icon}@2x.png`}
                        alt="weather-icon"
                        width={30}
                        height={30}
                        className="mr-2.5"
                    />
                )}
                {currentWeatherData.temperature}
                {degreeDisplay}
            </button>
        </>
    );
}

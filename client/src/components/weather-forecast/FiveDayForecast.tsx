import React, { JSX } from 'react';
import { GET_FIVE_DAY_FORECAST } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { FiveDayForecastProps } from '../../types/weather';
import { Weather } from '../../../../types/weather';

export default function FiveDayForecast({ city, units }: FiveDayForecastProps): JSX.Element {
    const {
        data: forecastData,
        loading: forecastLoading,
        error: forecastError,
    } = useQuery(GET_FIVE_DAY_FORECAST, {
        variables: { city, units },
    });

    return (
        <>
            {/* 5-Day Weather Forecast Section */}
            {forecastLoading ? (
                <p>Loading forecast...</p>
            ) : forecastError ? (
                <p>Error fetching forecast: {forecastError.message}</p>
            ) : (
                forecastData && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">5-Day Weather Forecast</h3>
                        <div className="flex space-x-4 overflow-x-auto">
                            {' '}
                            {/* Horizontal layout for the forecast cards */}
                            {forecastData.getFiveDayForecast.map((day: Weather, index: number) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-64 bg-white p-4 rounded-lg shadow-lg border-2 border-black"
                                >
                                    <h4 className="text-lg font-semibold">{day.description}</h4>
                                    <p className="text-xl font-bold">{day.temperature}°C</p>
                                    <p className="text-sm text-gray-500">
                                        Min: {day.minTemperature}°C, Max: {day.maxTemperature}°C
                                    </p>
                                    <Image
                                        src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                                        alt={day.description}
                                        width={40}
                                        height={40}
                                        className="mx-auto my-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </>
    );
}

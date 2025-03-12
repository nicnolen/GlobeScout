import React, { JSX } from 'react';
import { GET_FIVE_DAY_FORECAST } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { Weather, Units } from '../../../../types/weather';
import Tooltip from '../common/Tooltip';

interface FiveDayForecastProps {
    city: string;
    units: Units;
}

export default function FiveDayForecast({ city, units }: FiveDayForecastProps): JSX.Element {
    const {
        data: forecastData,
        loading: forecastLoading,
        error: forecastError,
    } = useQuery(GET_FIVE_DAY_FORECAST, {
        variables: { city, units },
    });

    const isUnitsCelcius = units === Units.Metric;
    const degreeDisplay = isUnitsCelcius ? '°C' : '°F';
    const visibilityDisplay = isUnitsCelcius ? 'm' : 'mi';
    const windSpeedDisplay = isUnitsCelcius ? 'm/s' : 'mph';

    return (
        <>
            {/* 5-Day Weather Forecast Section */}
            {forecastLoading ? (
                <p>Loading forecast...</p>
            ) : forecastError ? (
                <p>Error fetching forecast: {forecastError.message}</p>
            ) : (
                forecastData && (
                    <div className="rounded-lg shadow-lg border-2 border-gray-300 p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">5-Day Weather Forecast</h3>

                        {/* Forecast Cards */}
                        <div className="flex flex-wrap justify-center gap-4 overflow-x-auto mb-6">
                            {forecastData.getFiveDayForecast.map((day: Weather, index: number) => {
                                const {
                                    date,
                                    icon,
                                    description,
                                    temperature,
                                    minTemperature,
                                    maxTemperature,
                                    humidity,
                                    pressure,
                                    visibility,
                                    windSpeed,
                                } = day;

                                const weatherIconTooltipMessage = description;

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-between w-64 p-4 rounded-lg shadow-lg border-2 border-gray-300 mt-6"
                                    >
                                        {/* Date above the card */}
                                        <h4 className="text-lg font-semibold mb-2">{date}</h4>

                                        {/* Weather Card */}
                                        <div className="flex flex-col items-center justify-center mb-2">
                                            <Tooltip message={weatherIconTooltipMessage}>
                                                <Image
                                                    src={`http://openweathermap.org/img/wn/${icon}.png`}
                                                    alt={description}
                                                    width={40}
                                                    height={40}
                                                    className="mx-2"
                                                />
                                            </Tooltip>
                                            <p className="text-xl font-bold">
                                                {temperature}
                                                {degreeDisplay}
                                            </p>
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Min:</span> {minTemperature}
                                            {degreeDisplay} / <span className="font-semibold">Max:</span>{' '}
                                            {maxTemperature}
                                            {degreeDisplay}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Humidity:</span> {humidity}%
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Pressure:</span> {pressure} hPa
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Visibility:</span> {visibility}{' '}
                                            {visibilityDisplay}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Wind Speed:</span> {windSpeed}{' '}
                                            {windSpeedDisplay}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            )}
        </>
    );
}

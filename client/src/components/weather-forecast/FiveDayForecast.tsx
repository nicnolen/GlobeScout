import React, { JSX } from 'react';
import { GET_FIVE_DAY_FORECAST } from '../../graphQL/weatherQueries';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { Weather, Units } from '../../../../types/weather';
import Tooltip from '../common/Tooltip';

interface FiveDayForecastProps {
    locationSearch: string;
    units: Units;
}

export default function FiveDayForecast({ locationSearch, units }: FiveDayForecastProps): JSX.Element {
    const {
        data: forecastData,
        loading: forecastLoading,
        error: forecastError,
    } = useQuery(GET_FIVE_DAY_FORECAST, {
        variables: { locationSearch, units },
    });

    const isUnitsCelcius = units === Units.Metric;
    const degreeDisplay = isUnitsCelcius ? '°C' : '°F';
    const visibilityDisplay = isUnitsCelcius ? 'm' : 'mi';
    const windSpeedDisplay = isUnitsCelcius ? 'm/s' : 'mph';

    return (
        <>
            {forecastLoading ? (
                <p className="cardTitle">Loading forecast...</p>
            ) : forecastError ? (
                <p className="cardTitle text-red-500">Error fetching forecast: {forecastError.message}</p>
            ) : (
                forecastData && (
                    <div className="card p-8 mb-8">
                        <h3 className="cardTitle text-center">5-Day Weather Forecast</h3>

                        {/* Forecast Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
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
                                        className="flex flex-col items-center justify-between w-full p-4 rounded-lg shadow-lg border-2 border-gray-300"
                                    >
                                        <h4 className="text-lg font-semibold text-center text-gray-800 mb-4">{date}</h4>

                                        <div className="flex flex-col items-center justify-center mb-4">
                                            <Tooltip message={weatherIconTooltipMessage}>
                                                <Image
                                                    src={`http://openweathermap.org/img/wn/${icon}.png`}
                                                    alt={description}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-full"
                                                />
                                            </Tooltip>
                                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                                {temperature}
                                                {degreeDisplay}
                                            </p>
                                        </div>

                                        <div className="text-sm text-gray-600 text-center space-y-1">
                                            <p>
                                                <span className="font-semibold">Min:</span> {minTemperature}
                                                {degreeDisplay} / <span className="font-semibold">Max:</span>{' '}
                                                {maxTemperature}
                                                {degreeDisplay}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Humidity:</span> {humidity}%
                                            </p>
                                            <p>
                                                <span className="font-semibold">Pressure:</span> {pressure} hPa
                                            </p>
                                            <p>
                                                <span className="font-semibold">Visibility:</span> {visibility}{' '}
                                                {visibilityDisplay}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Wind Speed:</span> {windSpeed}{' '}
                                                {windSpeedDisplay}
                                            </p>
                                        </div>
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

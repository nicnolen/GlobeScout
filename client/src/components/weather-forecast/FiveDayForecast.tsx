import React, { JSX } from 'react';
import { GET_FIVE_DAY_FORECAST } from '../../graphQL/queries';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { Weather, Units } from '../../../../types/weather';

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

    return (
        <>
            {/* 5-Day Weather Forecast Section */}
            {forecastLoading ? (
                <p>Loading forecast...</p>
            ) : forecastError ? (
                <p>Error fetching forecast: {forecastError.message}</p>
            ) : (
                forecastData && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Weather forecast for {city}</h2>

                        <div className="rounded-lg shadow-lg border-2 border-black p-4">
                            <h3 className="text-xl font-bold mb-4 mt-2 ms-3">5-Day Weather Forecast</h3>

                            {/* Forecast Cards */}
                            <div className="flex flex-wrap justify-center gap-4 overflow-x-auto mb-6">
                                {forecastData.getFiveDayForecast.map((day: Weather, index: number) => {
                                    const { date, icon, description, temperature, minTemperature, maxTemperature } =
                                        day;

                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-between w-64 p-4 rounded-lg shadow-lg border-2 border-black mt-6"
                                        >
                                            {/* Date above the card */}
                                            <h4 className="text-lg font-semibold mb-2">{date}</h4>

                                            {/* Weather Card */}
                                            <div className="flex flex-col items-center justify-center mb-2">
                                                <Image
                                                    src={`http://openweathermap.org/img/wn/${icon}.png`}
                                                    alt={description}
                                                    width={40}
                                                    height={40}
                                                    className="mx-2"
                                                />
                                                <p className="text-xl font-bold">
                                                    {temperature}
                                                    {degreeDisplay}
                                                </p>
                                            </div>

                                            <p className="text-sm text-gray-500">
                                                Min: {minTemperature}
                                                {degreeDisplay}, Max: {maxTemperature}
                                                {degreeDisplay}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )
            )}
        </>
    );
}

'use client';

import React, { JSX, useState } from 'react';
import { useLazyQuery, ApolloError } from '@apollo/client';
import { GET_CURRENT_WEATHER } from '../../graphQL/queries';
import { Units } from '../../../../types/weather';
import WeatherTitle from '../../components/globe-scout/GlobeScoutTitle';
import WeatherInput from '../../components/globe-scout/GlobeScoutSearchbar';
import WeatherForecastButton from '../../components/globe-scout/WeatherForecastButton';

export default function GlobeScout(): JSX.Element {
    const [city, setCity] = useState('');
    const [units, setUnits] = useState<Units>(Units.Imperial); // Default to Imperial units

    const [getCurrentWeather, { data: currentWeatherData, loading, error }] = useLazyQuery(GET_CURRENT_WEATHER);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        getCurrentWeather({ variables: { city, units } }); // Trigger the query when the form is submitted
    };

    const isError = error instanceof ApolloError;

    return (
        <div>
            <WeatherTitle city={city} loading={loading} error={error} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <WeatherInput city={city} setCity={setCity} />

                <WeatherForecastButton
                    currentWeatherData={currentWeatherData}
                    units={units}
                    setUnits={setUnits}
                    loading={loading}
                    isError={isError}
                />
            </form>
        </div>
    );
}

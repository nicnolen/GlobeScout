'use client';
import React, { JSX, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { CurrentWeather } from '../../../../types/weather';
import { useCurrentWeatherMessage } from '../../hooks/weatherHooks';
import { GET_CURRENT_WEATHER } from '../../graphQL/queries';
import { selectCity, selectUnits } from '../../redux/selectors/weatherSelectors';
import WeatherTitle from '../../components/globe-scout/GlobeScoutTitle';
import WeatherInput from '../../components/globe-scout/GlobeScoutSearchbar';
import WeatherForecastButton from '../../components/globe-scout/WeatherForecastButton';

export default function GlobeScout(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const city = useSelector(selectCity);
    const units = useSelector(selectUnits);

    const [
        getCurrentWeather,
        { data: currentWeatherData, loading: currentWeatherLoading, error: currentWeatherError },
    ] = useLazyQuery<{
        getCurrentWeather: CurrentWeather;
    }>(GET_CURRENT_WEATHER);

    useCurrentWeatherMessage({
        currentWeatherLoading,
        currentWeatherError,
        setMessage,
    });

    const isLoading = currentWeatherLoading;
    const isError = currentWeatherError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        getCurrentWeather({ variables: { city, units } });
    };

    return (
        <div>
            {city && <WeatherTitle city={city} message={message} />}

            <form onSubmit={handleSubmit} className="flex items-center mb-2.5">
                <WeatherInput city={city} />

                {currentWeatherData && (
                    <WeatherForecastButton
                        currentWeatherData={currentWeatherData.getCurrentWeather}
                        isLoading={isLoading}
                        isError={isError}
                    />
                )}
            </form>
        </div>
    );
}

'use client';
import React, { JSX, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { Weather } from '../../../../types/weather';
import { useCurrentWeatherData } from '../../hooks/weatherHooks';
import { GET_CURRENT_WEATHER } from '../../graphQL/weatherQueries';
import { GET_TOP_TEN_PLACES } from '../../graphQL/googleMapsQueries';
import { selectLocation, selectUnits } from '../../redux/selectors/weatherSelectors';
import WeatherTitle from '../../components/globe-scout/GlobeScoutTitle';
import WeatherInput from '../../components/globe-scout/GlobeScoutSearchbar';
import WeatherForecastButton from '../../components/globe-scout/WeatherForecastButton';
// import GlobeScoutMap from '../../components/globe-scout/GlobeScoutMap';

export default function GlobeScout(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const location = useSelector(selectLocation);
    const units = useSelector(selectUnits);

    const [
        getCurrentWeather,
        { data: currentWeatherData, loading: currentWeatherLoading, error: currentWeatherError },
    ] = useLazyQuery<{
        getCurrentWeather: Weather;
    }>(GET_CURRENT_WEATHER);

    const [getTopTenPlaces, { data: topTenPlacesData, loading: topTenPlacesLoading, error: topTenPlacesError }] =
        useLazyQuery(GET_TOP_TEN_PLACES);

    useCurrentWeatherData({
        currentWeatherLoading,
        currentWeatherError,
        currentWeatherData: currentWeatherData ? currentWeatherData.getCurrentWeather : null,
        setMessage,
    });

    const isLoading = currentWeatherLoading;
    const isError = currentWeatherError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        getCurrentWeather({ variables: { location, units } });
        getTopTenPlaces({ variables: { locationSearch: location } });
    };

    return (
        <div>
            {location && <WeatherTitle location={location} message={message} />}

            <form onSubmit={handleSubmit} className="flex items-center mb-2.5">
                <WeatherInput location={location} />

                {currentWeatherData && (
                    <WeatherForecastButton
                        currentWeatherData={currentWeatherData.getCurrentWeather}
                        isLoading={isLoading}
                        isError={isError}
                    />
                )}
            </form>
            {/* <GlobeScoutMap /> */}
        </div>
    );
}

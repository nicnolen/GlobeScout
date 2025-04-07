'use client';

import React, { JSX, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { Weather } from '../../../../types/weather';
import { PlaceProps } from '../../../../types/googleMaps';
import { useCurrentWeatherData } from '../../hooks/weatherHooks';
import { GET_CURRENT_WEATHER } from '../../graphQL/weatherQueries';
import { GET_TOP_TEN_PLACES } from '../../graphQL/googleMapsQueries';
import { selectLocationSearch, selectUnits } from '../../redux/selectors/weatherSelectors';
import GlobeScoutTitle from '../../components/globe-scout/GlobeScoutTitle';
import GlobeScoutSearchbar from '../../components/globe-scout/GlobeScoutSearchbar';
import WeatherForecastButton from '../../components/globe-scout/WeatherForecastButton';
import TopPlacesList from '../../components/globe-scout/GlobeScoutTopPlacesList';

export default function GlobeScout(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const locationSearch = useSelector(selectLocationSearch);
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

        getCurrentWeather({ variables: { locationSearch, units } });
        getTopTenPlaces({ variables: { locationSearch: locationSearch } });
    };

    return (
        <div className="w-full">
            {/* Conditionally render the title if locationSearch is available */}
            {locationSearch && <GlobeScoutTitle locationSearch={locationSearch} message={message} />}

            {/* Search bar and weather button */}
            <form onSubmit={handleSubmit} className="flex items-center mb-2.5">
                <GlobeScoutSearchbar locationSearch={locationSearch} />

                {currentWeatherData && (
                    <WeatherForecastButton
                        currentWeatherData={currentWeatherData.getCurrentWeather}
                        isLoading={isLoading}
                        isError={isError}
                    />
                )}
            </form>

            {/* Places List */}
            <div>
                {topTenPlacesLoading ? (
                    <p>Loading top places...</p>
                ) : topTenPlacesError ? (
                    <p>{topTenPlacesError.message}</p>
                ) : (
                    <>
                        <h2 className="subtitle mt-8">Top 10 Places</h2>
                        {topTenPlacesData?.getTopTenPlaces?.map((place: PlaceProps, index: number) => (
                            <TopPlacesList
                                key={index}
                                rank={index + 1}
                                name={place.name}
                                address={place.address}
                                description={place.description}
                                primaryType={place.primaryType}
                                rating={place.rating}
                                userRatingCount={place.userRatingCount}
                                priceLevel={place.priceLevel}
                                websiteUri={place.websiteUri}
                                businessStatus={place.businessStatus}
                                nationalPhoneNumber={place.nationalPhoneNumber}
                                regularOpeningHours={place.regularOpeningHours}
                                parking={place.parking}
                                timeZone={place.timeZone}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Units, Weather } from '../../../../types/weather';
import { selectUnits } from '../../redux/selectors/weatherSelectors';

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

    const handleWeatherButtonClick = () => {
        if (currentWeatherData) {
            router.push('/weather-forecast');
        }
    };

    const isUnitsCelcius = units === Units.Metric;
    const degreeDisplay = isUnitsCelcius ? '°C' : '°F';
    return (
        <button
            type="button"
            onClick={handleWeatherButtonClick}
            disabled={isLoading || !!isError || !currentWeatherData} // !!error will convert ApolloError to true and null to false
            className="button primaryButton py-2 px-4"
        >
            {currentWeatherData.icon && (
                <Image
                    src={`https://openweathermap.org/img/wn/${currentWeatherData.icon}@2x.png`}
                    alt="weather-icon"
                    width={30}
                    height={30}
                />
            )}
            {currentWeatherData.temperature}
            {degreeDisplay}
        </button>
    );
}

import { ApolloError } from '@apollo/client';
import { CurrentWeather, Units } from '../../../types/weather';

// Redux
export interface WeatherState {
    city: string;
    units: Units;
}

// Custom Interfaces
export interface WeatherForecastButtonProps {
    currentWeatherData: CurrentWeather;
    isLoading: boolean;
    isError: ApolloError | null;
}

export interface UseWeatherMessageParams {
    currentWeatherLoading: boolean;
    currentWeatherError: Error | undefined;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface FiveDayForecastProps {
    city: string;
    units: Units;
}

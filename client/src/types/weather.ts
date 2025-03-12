import { Units, Weather } from '../../../types/weather';

// Redux
export interface WeatherState {
    city: string;
    units: Units;
    currentWeatherData: Weather | null;
}

import { Units, Weather } from '../../../types/weather';

// Redux
export interface WeatherState {
    location: string;
    units: Units;
    currentWeatherData: Weather | null;
}

import { Units, Weather } from '../../../types/weather';

// Redux
export interface WeatherState {
    locationSearch: string;
    units: Units;
    currentWeatherData: Weather | null;
}

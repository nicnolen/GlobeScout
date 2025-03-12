import { RootState } from '../store';
import { Units, Weather } from '../../../../types/weather';

export const selectCity = (state: RootState): string => state.weather.city;
export const selectUnits = (state: RootState): Units => state.weather.units;
export const selectCurrentWeatherData = (state: RootState): Weather => state.weather.currentWeatherData;

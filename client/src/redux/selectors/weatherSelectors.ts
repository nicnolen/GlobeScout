import { RootState } from '../store';
import { Units, Weather } from '../../../../types/weather';

export const selectLocationSearch = (state: RootState): string => state.weather.locationSearch;
export const selectUnits = (state: RootState): Units => state.weather.units;
export const selectCurrentWeatherData = (state: RootState): Weather => state.weather.currentWeatherData;

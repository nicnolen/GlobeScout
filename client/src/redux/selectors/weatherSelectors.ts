import { RootState } from '../store';
import { Units, Weather } from '../../../../types/weather';

export const selectLocation = (state: RootState): string => state.weather.location;
export const selectUnits = (state: RootState): Units => state.weather.units;
export const selectCurrentWeatherData = (state: RootState): Weather => state.weather.currentWeatherData;

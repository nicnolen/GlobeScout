import { RootState } from '../store';
import { Units } from '../../../../types/weather';

export const selectCity = (state: RootState): string => state.weather.city;
export const selectUnits = (state: RootState): Units => state.weather.units;

import { RootState } from '../store';
import { Units } from '../../../../types/weather';

export const selectUnits = (state: RootState): Units => state.weather.units;

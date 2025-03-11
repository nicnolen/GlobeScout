import { PayloadAction } from '@reduxjs/toolkit';
import { WeatherState } from '../../types/weather';
import { Units } from '../../../../types/weather';

export const setCity = (state: WeatherState, action: PayloadAction<string>) => {
    state.city = action.payload;
};
export const setUnits = (state: WeatherState, action: PayloadAction<Units>) => {
    state.units = action.payload;
};

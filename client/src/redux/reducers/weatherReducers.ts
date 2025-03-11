import { PayloadAction } from '@reduxjs/toolkit';
import { Units, WeatherState } from '../../types/weather';

export const setUnits = (state: WeatherState, action: PayloadAction<Units>) => {
    state.units = action.payload;
};

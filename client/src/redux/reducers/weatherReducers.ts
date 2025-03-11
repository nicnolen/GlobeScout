import { PayloadAction } from '@reduxjs/toolkit';
import { WeatherState } from '../../types/weather';
import { Units } from '../../../../types/weather';

export const setUnits = (state: WeatherState, action: PayloadAction<Units>) => {
    state.units = action.payload;
};

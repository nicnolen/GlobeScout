import { PayloadAction } from '@reduxjs/toolkit';
import { WeatherState } from '../../types/weather';
import { Units, Weather } from '../../../../types/weather';

export const setLocation = (state: WeatherState, action: PayloadAction<string>) => {
    state.location = action.payload;
};
export const setUnits = (state: WeatherState, action: PayloadAction<Units>) => {
    state.units = action.payload;
};

export const setCurrentWeatherData = (state: WeatherState, action: PayloadAction<Weather | null>) => {
    state.currentWeatherData = action.payload;
};

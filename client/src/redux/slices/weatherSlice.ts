import { createSlice } from '@reduxjs/toolkit';
import { WeatherState } from '../../types/weather';
import { Units } from '../../../../types/weather';
import * as weatherReducers from '../reducers/weatherReducers';

const initialState: WeatherState = {
    location: '',
    units: Units.Imperial,
    currentWeatherData: null,
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: weatherReducers,
});

// define actions
export const { setLocation, setUnits, setCurrentWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;

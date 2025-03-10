import { createSlice } from '@reduxjs/toolkit';
import { Units, WeatherState } from '../../types/weather';
import * as weatherReducers from '../reducers/weatherReducers';

const initialState: WeatherState = {
    units: Units.Imperial,
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: weatherReducers,
});

// define actions
export const { setUnits } = weatherSlice.actions;

export default weatherSlice.reducer;

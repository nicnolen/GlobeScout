import { createSlice } from '@reduxjs/toolkit';
import { WeatherState } from '../../types/weather';
import { Units } from '../../../../types/weather';
import * as weatherReducers from '../reducers/weatherReducers';

const initialState: WeatherState = {
    locationSearch: '',
    units: Units.Imperial,
    currentWeatherData: null,
};

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: weatherReducers,
});

// define actions
export const { setLocationSearch, setUnits, setCurrentWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;

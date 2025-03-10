import { configureStore } from '@reduxjs/toolkit';
import WeatherReducer from './slices/weatherSlice';

export const store = configureStore({
    reducer: {
        weather: WeatherReducer,
    },
});

// Create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

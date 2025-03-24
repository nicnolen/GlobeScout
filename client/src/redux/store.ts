import { configureStore } from '@reduxjs/toolkit';
import WeatherReducer from './slices/weatherSlice';
import UsersReducer from './slices/usersSlice';

export const store = configureStore({
    reducer: {
        weather: WeatherReducer,
        users: UsersReducer,
    },
});

// Create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

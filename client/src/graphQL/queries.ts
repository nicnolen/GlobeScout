import { gql } from '@apollo/client';

export const GET_CURRENT_WEATHER = gql`
    query GetCurrentWeather($city: String!, $units: Units!) {
        getCurrentWeather(city: $city, units: $units) {
            description
            icon
            temperature
            minTemperature
            maxTemperature
            humidity
            pressure
            visibility
            windSpeed
            windDirection
            sunrise
            sunset
        }
    }
`;

export const GET_FIVE_DAY_FORECAST = gql`
    query GetFiveDayForecast($city: String!, $units: Units!) {
        getFiveDayForecast(city: $city, units: $units) {
            description
            icon
            temperature
            minTemperature
            maxTemperature
            humidity
            pressure
            visibility
            windSpeed
            windDirection
            sunrise
            sunset
        }
    }
`;

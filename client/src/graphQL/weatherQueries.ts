import { gql } from '@apollo/client';

export const GET_CURRENT_WEATHER = gql`
    query GetCurrentWeather($locationSearch: String!, $units: Units!) {
        getCurrentWeather(locationSearch: $locationSearch, units: $units) {
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
    query GetFiveDayForecast($locationSearch: String!, $units: Units!) {
        getFiveDayForecast(locationSearch: $locationSearch, units: $units) {
            date
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

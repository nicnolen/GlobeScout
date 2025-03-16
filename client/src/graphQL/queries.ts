import { gql } from '@apollo/client';

export const GET_CURRENT_WEATHER = gql`
    query GetCurrentWeather($location: String!, $units: Units!) {
        getCurrentWeather(location: $location, units: $units) {
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
    query GetFiveDayForecast($location: String!, $units: Units!) {
        getFiveDayForecast(location: $location, units: $units) {
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

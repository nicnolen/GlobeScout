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
    query GetFiveDayForecast($lat: Float!, $lon: Float!, $units: Units!) {
        getFiveDayForecast(lat: $lat, lon: $lon, units: $units) {
            description
            icon
            temperature
            minTemperature
            maxTemperature
            feelsLike
            rain
            humidity
            pressure
            visibility
            windSpeed
            windDirection
            windGust
            sunrise
            sunset
        }
    }
`;

export const GET_WEATHER = `
    enum Units {
      metric
      imperial
    }

    type Weather {
      date: String
      description: String
      icon: String!
      temperature: Int!
      minTemperature: Int!
      maxTemperature: Int!
      humidity: Int
      pressure: Int
      visibility: Int
      windSpeed: Float
      windDirection: Int
      sunrise: Int
      sunset: Int
  }

  type Query {
    getCurrentWeather(locationSearch: String!, units: Units!): Weather
    getFiveDayForecast(locationSearch: String!, units: Units!): [Weather]
  }
`;

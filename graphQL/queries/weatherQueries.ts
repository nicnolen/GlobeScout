export const GET_WEATHER = `
    enum Units {
      metric
      imperial
    }

    type Weather {
      description: String
      icon: String!
      temperature: Float!
      minTemperature: Float!
      maxTemperature: Float!
      humidity: Int
      pressure: Int
      visibility: Int
      windSpeed: Float
      windDirection: Int
      sunrise: Int
      sunset: Int
  }

  type Query {
    getCurrentWeather(city: String!, units: Units!): Weather
  }
`;

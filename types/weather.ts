export enum Units {
    Metric = 'metric',
    Imperial = 'imperial',
}

// GraphQL query structure
export interface Weather {
    date?: string;
    description: string;
    icon: string;
    temperature: number;
    minTemperature: number;
    maxTemperature: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    sunrise: number;
    sunset: number;
}

// A daily forecast, with the data aggregated and averaged
export interface DailyWeather {
    date: string;
    description: string;
    icon: string;
    temperature: number; // Average of 3-hour temperatures
    minTemperature: number; // Minimum temperature for the day
    maxTemperature: number; // Maximum temperature for the day
    humidity: number; // Average humidity for the day
    pressure: number; // Average pressure for the day
    visibility: number; // Average visibility for the day
    windSpeed: number; // Average wind speed for the day
}

// Alias
export type FiveDayForecast = DailyWeather[];

// Interface for the OpenWeatherMap API response for current weather by city name
export interface CurrentWeatherResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: [
        {
            id: number;
            main: string;
            description: string;
            icon: string;
        },
    ];
    base: string;
    main: {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        message: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    id: number;
    name: string;
    cod: number;
}

export interface FiveDayForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
        sunset: any;
        sunrise: any;
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            sea_level: number;
            grnd_level: number;
            humidity: number;
            temp_kf: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        clouds: {
            all: number;
        };
        wind: {
            speed: number;
            deg: number;
            gust: number;
        };
        visibility: number;
        pop: number;
        sys: {
            pod: string;
        };
        dt_txt: string;
    }>;
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

export enum Units {
    Metric = 'metric',
    Imperial = 'imperial',
}

export interface WeatherForecastButtonProps {
    currentWeatherData: any;
    units: Units;
    setUnits: React.Dispatch<React.SetStateAction<Units>>;
    loading: boolean;
    isError: boolean;
}

// GraphQL query structure
export interface Weather {
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

// GraphQL resolvers
export interface GetCurrentWeatherArgs {
    city: string;
    units: Units;
}

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

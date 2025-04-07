import { User } from './users';

export interface Context {
    user: User | null;
    apiKeys: {
        googleMapsApiKey: string | null;
        openWeatherApiKey: string | null;
    };
    apiBaseUrls: {
        googleMapsTextSearchUrl: string | null;
        openWeatherUrl: string | null;
    };
}

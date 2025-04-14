import { User } from './users';

export interface Context {
    user: User;
    apiKeys: {
        googleMapsApiKey: string | null;
        openWeatherApiKey: string | null;
    };
    apiBaseUrls: {
        googleMapsTextSearchUrl: string | null;
        openWeatherUrl: string | null;
    };
}

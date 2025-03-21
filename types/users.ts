export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

// User data types to be used in the frontend (password excuded)
export interface UserData {
    email: string;
    role: UserRole;
    lastLogin: Date | null;
    active: boolean;
    services: {
        openWeatherApi: { requestsMade: number; maxRequests: number };
        googleMapsApi: { requestsMade: number; maxRequests: number };
    };
}

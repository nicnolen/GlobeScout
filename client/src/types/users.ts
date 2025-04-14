export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

// User data types to be used in the frontend (password excuded)
export interface UserData {
    email: string;
    role: UserRole;
    lastLogin?: string;
    active: boolean;
    authentication: {
        enabled: boolean;
        methods: {
            email: boolean;
            authenticator: boolean;
        };
        authenticatorSecret?: string;
        emailCode?: string;
        emailCodeExpiration?: Date;
    };
    services: {
        openWeatherApi?: { requestsMade: number; maxRequests: number };
        googleMapsApi?: { requestsMade: number; maxRequests: number };
    };
}

// Redux
export interface UserState {
    user: UserData | null;
}

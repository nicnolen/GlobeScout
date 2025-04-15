export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum AuthMethod {
    EMAIL = 'email',
    AUTHENTICATOR = 'authenticator',
}

export interface ServiceUsage {
    requestsMade: number;
    maxRequests: number;
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
    services?: Record<string, ServiceUsage>;
}

// Redux
export interface UserState {
    user: UserData | null;
}

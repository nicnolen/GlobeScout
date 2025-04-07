import { ObjectId } from 'mongoose';

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
        openWeatherApi: { requestsMade: number; maxRequests: number };
        googleMapsApi: { requestsMade: number; maxRequests: number };
    };
}

export interface User extends UserData {
    _id: ObjectId;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
    __v: number;
}

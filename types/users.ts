import { ObjectId } from 'mongoose';

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
            [key in AuthMethod]: boolean;
        };
        authenticatorSecret?: string;
        emailCode?: string;
        emailCodeExpiration?: Date;
    };
    services: {
        [key: string]: ServiceUsage; // Allows dynamic service keys
    };
}

export interface User extends UserData {
    _id: ObjectId;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
    __v: number;
}

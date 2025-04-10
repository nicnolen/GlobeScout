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

// Define the input for editing a user
export interface EditUserInput {
    email: string;
    role: UserRole;
    active: boolean;
    authentication: {
        enabled: boolean;
        methods: {
            email: boolean;
            authenticator: boolean;
        };
    };
    services?: Record<string, ServiceUsage>; // Allow dynamic services
}

// User data types to be used in the frontend (password excuded)
export interface UserData extends EditUserInput {
    lastLogin?: string;
    authentication: {
        enabled: boolean;
        methods: {
            [key in AuthMethod]: boolean;
        };
        authenticatorSecret?: string;
        emailCode?: string;
        emailCodeExpiration?: Date;
    };
}

export interface User extends UserData {
    _id: ObjectId;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
    __v: number;
}

// Props
export interface EditUserProps {
    email: string;
    input: EditUserInput;
}

export interface DeleteUserProps {
    email: string;
}

export interface ResetSingleApiCallsProps {
    email: string;
    service: string;
}

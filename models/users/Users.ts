import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserData, UserRole } from '../../types/users';

export interface UsersDocument extends UserData, Document {
    password: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    comparePasswords(password: string): Promise<boolean>;
}

const UsersSchema = new Schema<UsersDocument>({
    email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Must match an email address!'] },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    authentication: {
        enabled: { type: Boolean, required: true, default: false },
        methods: {
            email: { type: Boolean, default: true },
            authenticator: { type: Boolean, default: false },
        },
        authenticatorSecret: { type: String },
        emailCode: { type: String },
        emailCodeExpiration: { type: Date },
    },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    lastLogin: { type: String, default: 'Never' },
    active: { type: Boolean, default: false },
    services: {
        openWeatherApi: { requestsMade: { type: Number }, maxRequests: { type: Number } },
        googleMapsApi: { requestsMade: { type: Number }, maxRequests: { type: Number } },
    },
});

// Set up pre-save middleware to create password
UsersSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// Compare the incoming password with the hashed password
UsersSchema.methods.comparePasswords = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const modelName = process.env.USERS_MODEL_NAME || 'users';

if (!modelName) {
    throw new Error('USERS_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] || mongoose.model<UsersDocument>(modelName, UsersSchema, modelName);

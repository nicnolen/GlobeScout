import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserData, UserRole } from '../../types/users';

export interface UsersDocument extends UserData, Document {
    password: string;
    comparePasswords(password: string): Promise<boolean>;
}

const UsersSchema = new Schema<UsersDocument>({
    email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Must match an email address!'] },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    lastLogin: { type: Date, default: null },
    active: { type: Boolean, default: true },
    services: {
        openWeatherApi: { requestsMade: { type: Number, default: 0 }, maxRequests: { type: Number, default: 100 } },
        googleMapsApi: { requestsMade: { type: Number, default: 0 }, maxRequests: { type: Number, default: 50 } },
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

const modelName = process.env.USERS_MODEL_NAME;

if (!modelName) {
    throw new Error('USERS_MODEL_NAME environment variable is not defined');
}

export default mongoose.models[modelName] || mongoose.model<UsersDocument>(modelName, UsersSchema, modelName);

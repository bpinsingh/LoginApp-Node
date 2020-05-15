import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
    email: string;
    token: string;
    password: string;
    profile: {
        name: string;
        age: string;
        mobile: string;
    };
};

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    token: String,
    password: String,
    profile: {
        name: String,
        age: String,
        mobile: String
    }
}, { timestamps: true });

export const User = mongoose.model<UserDocument>("User", userSchema);

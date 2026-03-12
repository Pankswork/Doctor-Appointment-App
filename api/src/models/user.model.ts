import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient',
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    dateOfBirth: {
        type: Date,
    },
    weight: {
        type: String, // e.g., "70kg"
    },
    height: {
        type: String, // e.g., "175cm"
    },
}, {
    timestamps: true,
});

export const User = model('User', UserSchema);

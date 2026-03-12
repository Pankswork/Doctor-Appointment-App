import { Schema, model } from 'mongoose';

const DoctorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    availability: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
    }],
    about: {
        type: String,
    },
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const Doctor = model('Doctor', DoctorSchema);

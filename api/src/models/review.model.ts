import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Review = model('Review', ReviewSchema);

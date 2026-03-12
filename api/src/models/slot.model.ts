import { Schema, model } from 'mongoose';

const SlotSchema = new Schema({
    time: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Morning', 'Evening'],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 1,
    }
}, {
    timestamps: true,
});

export const Slot = model('Slot', SlotSchema);

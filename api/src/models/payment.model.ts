import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "INR"
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

export const Payment = model('Payment', PaymentSchema);

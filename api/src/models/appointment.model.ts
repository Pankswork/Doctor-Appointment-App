import { Schema, model } from 'mongoose';

const AppointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Patients are just Users with role 'patient'
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled', 'completed'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
    slotTime: {
        type: String,
        required: true,
    },
    slotType: {
        type: String,
        enum: ['Morning', 'Evening'],
        required: true,
    },
}, {
    timestamps: true,
});

export const Appointment = model('Appointment', AppointmentSchema);

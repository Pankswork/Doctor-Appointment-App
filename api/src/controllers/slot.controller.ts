import { Request, Response } from 'express';
import { Slot } from '../models/slot.model';
import { Appointment } from '../models/appointment.model';

const createSlot = async (req: Request, res: Response) => {
    try {
        const slot = await Slot.create(req.body);
        res.status(201).json({ success: true, message: 'Slot created successfully', data: slot });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getSlotsAvailability = async (req: Request, res: Response) => {
    try {
        const { date, doctorId } = req.query;
        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required' });
        }
        if (!doctorId) {
            return res.status(400).json({ success: false, message: 'Doctor ID is required' });
        }

        const slots = await Slot.find();
        
        const requestDate = new Date(date as string);
        const startOfDay = new Date(requestDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(requestDate.setHours(23, 59, 59, 999));

        // Find appointments for the given date AND specific doctor
        const appointments = await Appointment.find({
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            doctor: doctorId, // Filter by doctor
            status: { $ne: 'cancelled' }
        });

        const slotsWithAvailability = slots.map(slot => {
            // Count appointments for this specific slot time for this doctor
            const bookedCount = appointments.filter(app => app.slotTime === slot.time).length;
            // Capacity is per slot per doctor (implicitly, as we check per doctor)
            // If the slot model capacity is global (e.g. 10), it might mean 10 doctors can be booked?
            // OR 10 patients per doctor? 
            // The requirement says "time slot must be the same for all".
            // Usually, a doctor has 1 slot capacity per time.
            // If the seeded capacity is 10, maybe that was global.
            // For doctor-specific, capacity should probably be 1 (or whatever one doctor can handle).
            // Let's assume the Slot capacity in DB is the default capacity per doctor.
            // Or better, we treat Slot capacity as "Max concurrent appointments for this doctor type"?
            // Actually, usually a doctor can take 1 patient at a time.
            // So for a specific doctor, remaining should be 1 - bookedCount.
            // Unless the doctor has multiple chairs. 
            // Let's assume capacity = 1 for a specific doctor for now to be safe, 
            // OR use the slot.capacity if we assume admin sets how many patients a doctor handles.
            // The prompt says "user can able to choose there slot".
            // Let's use slot.capacity but interpret it as per-doctor if reasonable, 
            // but given the previous global implementation had 10, 10 for one doctor is a lot.
            // I will FORCE capacity to 1 for doctor-specific logic to ensure no double booking for the SAME doctor.
            
            const doctorCapacity = 1; 
            const remaining = doctorCapacity - bookedCount;
            
            return {
                ...slot.toObject(),
                bookedCount,
                remainingSlots: remaining > 0 ? remaining : 0
            };
        });

        res.status(200).json({ success: true, data: slotsWithAvailability });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

export const SlotController = {
    createSlot,
    getSlotsAvailability
};

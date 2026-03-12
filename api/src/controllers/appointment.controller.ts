import { Request, Response } from 'express';
import { Appointment } from '../models/appointment.model';

const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(201).json({ success: true, message: 'Appointment booked successfully', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getAllAppointments = async (req: Request, res: Response) => {
    try {
        // Admin or Doctor viewing logic could be added here
        const appointments = await Appointment.find()
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' } // Populate user inside doctor
            })
            .populate('patient', 'name email');
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getMyAppointments = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        // @ts-ignore
        const role = req.user.role;

        let query = {};
        if (role === 'patient') {
            query = { patient: userId };
        } else if (role === 'doctor') {
            // Logic to find doctor profile first, then search by doctor ID
            // For simplicity assume doctorId is passed or we look it up. 
            // This part might need the Doctor model to look up the doctor ID from the User ID.
            // Leaving simple for now.
        }

        const appointments = await Appointment.find(query)
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email' }
            })
            .populate('patient', 'name email');

        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user.id;
        // @ts-ignore
        const role = req.user.role;

        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        // Patient specific logic
        if (role === 'patient') {
            if (status !== 'cancelled') {
                 return res.status(403).json({ success: false, message: 'Patients can only cancel appointments' });
            }
            if (appointment.patient.toString() !== userId) {
                 return res.status(403).json({ success: false, message: 'You are not authorized to cancel this appointment' });
            }
            if (appointment.status === 'approved') {
                 return res.status(400).json({ success: false, message: 'Cannot cancel an approved appointment' });
            }
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

export const AppointmentController = {
    createAppointment,
    getAllAppointments,
    getMyAppointments,
    updateAppointmentStatus
};

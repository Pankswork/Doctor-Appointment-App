import { Request, Response } from 'express';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';

const getStats = async (req: Request, res: Response) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = await Appointment.countDocuments({
            appointmentDate: { $gte: today, $lt: tomorrow }
        });

        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await Doctor.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                pendingAppointments,
                todayAppointments,
                totalPatients,
                totalDoctors
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats'
        });
    }
};

export const AdminController = {
    getStats
};

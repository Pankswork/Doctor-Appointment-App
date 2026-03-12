import express from 'express';
import { AuthRoutes } from './auth.routes';
import { DoctorController } from '../controllers/doctor.controller';
import { AppointmentController } from '../controllers/appointment.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.use('/auth', AuthRoutes);

// Doctor Routes
router.post(
  '/doctors',
  auth(['admin', 'doctor']),
  DoctorController.createDoctor,
);
router.get('/doctors', DoctorController.getAllDoctors);
router.get('/doctors/:id', DoctorController.getDoctorById);
router.patch(
  '/doctors/:id',
  auth(['admin', 'doctor']),
  DoctorController.updateDoctor,
);
router.delete('/doctors/:id', auth(['admin']), DoctorController.deleteDoctor);

// Appointment Routes
router.post(
  '/appointments',
  auth(['patient']),
  AppointmentController.createAppointment,
);
router.get(
  '/appointments',
  auth(['admin', 'doctor']),
  AppointmentController.getAllAppointments,
);
router.get(
  '/my-appointments',
  auth(['patient', 'doctor']),
  AppointmentController.getMyAppointments,
);
router.patch(
  '/appointments/:id',
  auth(['admin', 'doctor', 'patient']),
  AppointmentController.updateAppointmentStatus,
);

import { ContactController } from '../controllers/contact.controller';

// ... existing imports

// Contact Routes
// Contact Routes
router.post('/contacts', ContactController.createContact);
router.get('/contacts', auth(['admin']), ContactController.getAllContacts);

// User Routes
import { UserRoutes } from './user.routes';
router.use('/users', UserRoutes);

// Review Routes
import { ReviewRoutes } from './review.routes';
import { PaymentRoutes } from './payment.routes';

router.use('/reviews', ReviewRoutes);
router.use('/payments', PaymentRoutes);

// Admin Routes
import { AdminRoutes } from './admin.routes';
router.use('/admin', AdminRoutes);

import { SlotRoutes } from './slot.routes';
router.use('/slots', SlotRoutes);

export const AppRoutes = router;

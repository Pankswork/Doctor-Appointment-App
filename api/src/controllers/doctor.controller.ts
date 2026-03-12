import { Request, Response } from 'express';
import { Doctor } from '../models/doctor.model';
import { User } from '../models/user.model';

const createDoctor = async (req: Request, res: Response) => {
    try {
        const { userId, ...doctorData } = req.body;
        
        // Ensure user exists and is a doctor
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        if (user.role !== 'doctor') {
            return res.status(400).json({ success: false, message: 'User is not a doctor' });
        }

        let imageUrl = '';
        if (req.files && req.files.image) {
             const image = req.files.image as any;
             // Ensure public/uploads exists or use a library to handle it. 
             // Ideally we should use a cloud storage like Cloudinary or S3.
             // For local dev, we'll save to 'uploads' folder in root or public.
             // The upload functionality might depend on how `express-fileupload` is configured in app.ts.
             // Assuming it's set up to allow moving files.
             
             const uploadPath = `./public/uploads/${image.name}`;
             await image.mv(uploadPath);
             imageUrl = `/uploads/${image.name}`;
        } else if (req.body.image) {
            // Allow URL string fallback
            imageUrl = req.body.image;
        }

        // Only enforce image requirement if you want to. Model says required: true.
        if (!imageUrl) {
             return res.status(400).json({ success: false, message: 'Doctor profile image is required' });
        }

        const newDoctor = await Doctor.create({ user: userId, ...doctorData, image: imageUrl });
        res.status(201).json({ success: true, message: 'Doctor profile created', data: newDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await Doctor.find().populate('user', 'name email phoneNumber address');
        res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const getDoctorById = async (req: Request, res: Response) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phoneNumber address');
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const updateDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, phoneNumber, address, ...doctorData } = req.body;

        // 1. Check if doctor exists
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // 2. Handle Image Upload
        let imageUrl = doctor.image; // Default to existing image
        if (req.files && req.files.image) {
             const image = req.files.image as any;
             const uploadPath = `./public/uploads/${image.name}`;
             await image.mv(uploadPath);
             imageUrl = `/uploads/${image.name}`;
        }

        // 3. Update User Info (linked to doctor)
        if (name || email || phoneNumber || address) {
            await User.findByIdAndUpdate(doctor.user, {
                $set: {
                    ...(name && { name }),
                    ...(email && { email }),
                    ...(phoneNumber && { phoneNumber }),
                    ...(address && { address })
                }
            });
        }

        // 4. Update Doctor Info
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { ...doctorData, image: imageUrl },
            { new: true }
        ).populate('user', 'name email phoneNumber address');

        res.status(200).json({ success: true, data: updatedDoctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

const deleteDoctor = async (req: Request, res: Response) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
};

export const DoctorController = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};

import { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { Doctor } from '../models/doctor.model';

const createReview = async (req: Request, res: Response) => {
    if (!req.body.doctor) req.body.doctor = req.params.doctorId;
    
    // We assume the user is authenticated and req.user.id is available
    if (!req.body.patient) req.body.patient = (req as any).user.id;
    // We assume the username is available in req.user
    if (!req.body.username) req.body.username = (req as any).user.name || "Anonymous";

    const newReview = new Review(req.body);

    try {
        const savedReview = await newReview.save();
        res.status(200).json({ success: true, message: 'Review submitted', data: savedReview });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit review', error: err });
    }
};

const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({});
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found', error: err });
    }
};

export const ReviewController = {
    createReview,
    getAllReviews,
};

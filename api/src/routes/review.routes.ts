import express from 'express';
import { ReviewController } from '../controllers/review.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router
    .route('/')
    .get(ReviewController.getAllReviews)
    .post(auth(['patient']), ReviewController.createReview);

export const ReviewRoutes = router;

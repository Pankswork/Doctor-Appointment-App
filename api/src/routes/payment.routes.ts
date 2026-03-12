import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/create-order', auth(['patient']), PaymentController.createOrder);
router.post('/verify-payment', auth(['patient']), PaymentController.verifyPayment);

export const PaymentRoutes = router;

import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment } from '../models/payment.model';
import { Appointment } from '../models/appointment.model';
import config from '../config';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

const createOrder = async (req: Request, res: Response) => {
    try {
        const { amount, appointmentId } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_${appointmentId}`,
        };

        const order = await razorpay.orders.create(options);

        // Create Payment record
        const payment = new Payment({
            razorpayOrderId: order.id,
            amount: amount,
            appointment: appointmentId,
            status: 'pending'
        });
        await payment.save();

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};

const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update Payment status
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { 
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: 'success' 
                }
            );

            // Update Appointment payment status
            await Appointment.findByIdAndUpdate(appointmentId, {
                paymentStatus: 'paid'
            });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
             await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({
                success: false,
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const PaymentController = {
    createOrder,
    verifyPayment
};

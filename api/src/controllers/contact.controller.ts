import { Request, Response } from 'express';
import { Contact } from '../models/contact.model';

const createContact = async (req: Request, res: Response) => {
    try {
        const result = await Contact.create(req.body);
        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
        });
    }
};

const getAllContacts = async (req: Request, res: Response) => {
    try {
        const result = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve messages',
        });
    }
};

export const ContactController = {
    createContact,
    getAllContacts,
};

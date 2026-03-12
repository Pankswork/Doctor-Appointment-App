import { Request, Response } from 'express';
import { User } from '../models/user.model';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        let query = {};

        if (role) {
            query = { role };
        }

        const users = await User.find(query).select('-password');
        
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true }).select("-password");

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update",
        });
    }
};

export const UserController = {
    getAllUsers,
    updateUser,
};

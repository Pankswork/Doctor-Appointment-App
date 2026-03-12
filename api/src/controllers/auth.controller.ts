import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import config from '../config';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const isFirstAccount = (await User.countDocuments({})) === 0;
        let role = req.body.role || 'patient';

        if (isFirstAccount || email === 'admin@admin.com') {
            role = 'admin';
        } else if (role === 'admin') {
            role = 'patient';
        }

        const user = await User.create({
            ...req.body,
            password: hashedPassword,
            role: role,
        });

        // Don't send password back
        const userResponse = user.toObject();
        delete (userResponse as any).password;

        res.status(201).json({ success: true, message: 'User registered successfully', data: userResponse });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : '') : undefined
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret as string,
            { expiresIn: config.jwt_expires_in }
        );

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            data: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const googleLogin = async (req: Request, res: Response) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
             return res.status(400).json({ success: false, message: 'Missing Access Token' });
        }

        // Verify/Get User Info using Access Token
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { email, name, picture, sub } = userInfoResponse.data;

        if (!email) { 
            return res.status(400).json({ success: false, message: 'Invalid Google Token or Email permission missing' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
             user = await User.create({
                name: name,
                email: email,
                password: '', // No password for Google users
                role: 'patient', // Default role
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.jwt_secret as string,
            { expiresIn: config.jwt_expires_in }
        );

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            data: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const AuthController = {
    register,
    login,
    googleLogin
};

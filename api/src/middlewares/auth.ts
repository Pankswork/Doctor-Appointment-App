import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const auth = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ success: false, message: 'Authentication failed! Token missing.' });
            }

            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden! You do not have permission.' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Authentication failed! Invalid token.' });
        }
    };
};

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppRoutes } from './routes';
import config from './config';

import fileUpload from 'express-fileupload';
import path from 'path';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Debug Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Application Routes
app.use('/api/v1', AppRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: config.env === 'development' ? err : {},
    });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        errorMessages: [{ path: req.originalUrl, message: 'API Route not available' }],
    });
});

export default app;
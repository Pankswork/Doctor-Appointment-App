import mongoose from 'mongoose';
import app from './app';
import config from './config';
import connectDB from './config/db';

async function bootstrap() {
    try {
        await connectDB();
        
        app.listen(config.port, () => {
            console.log(`🚀 Application listening on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();
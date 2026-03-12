import mongoose from 'mongoose';
import config from './index';

const connectDB = async () => {
    try {
        if (!config.database_url) {
            console.error('Database URL is not defined in the configuration.');
            process.exit(1);
        }

        await mongoose.connect(config.database_url);
        console.log('🛢 Database Connected Successfully');

        mongoose.connection.on('error', (error) => {
             console.error('Database Connection Error:', error);
        });

    } catch (error) {
        console.error('Failed to connect to Database:', error);
        process.exit(1);
    }
};

export default connectDB;

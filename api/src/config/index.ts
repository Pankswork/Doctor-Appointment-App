import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    database_url: process.env.MONGO_URI || process.env.MONGO || 'mongodb://localhost:27017/doctor-appointment',
    jwt_secret: process.env.JWT_SECRET || 'secret',
    jwt_expires_in: process.env.JWT_EXPIRES_IN || '1d',
};
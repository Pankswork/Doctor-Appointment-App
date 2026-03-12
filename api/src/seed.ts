import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Slot } from './models/slot.model';

dotenv.config();

const seedSlots = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        await Slot.deleteMany({});
        console.log('Cleared existing slots');

        const morningSlots = [
            { time: '08:00 AM - 08:30 AM', type: 'Morning', capacity: 10 },
            { time: '08:30 AM - 09:00 AM', type: 'Morning', capacity: 10 },
            { time: '09:00 AM - 09:30 AM', type: 'Morning', capacity: 10 },
            { time: '09:30 AM - 10:00 AM', type: 'Morning', capacity: 10 },
            { time: '10:00 AM - 10:30 AM', type: 'Morning', capacity: 10 },
            { time: '10:30 AM - 11:00 AM', type: 'Morning', capacity: 10 },
        ];

        const eveningSlots = [
            { time: '04:00 PM - 04:30 PM', type: 'Evening', capacity: 10 },
            { time: '04:30 PM - 05:00 PM', type: 'Evening', capacity: 10 },
            { time: '05:00 PM - 05:30 PM', type: 'Evening', capacity: 10 },
            { time: '05:30 PM - 06:00 PM', type: 'Evening', capacity: 10 },
            { time: '06:00 PM - 06:30 PM', type: 'Evening', capacity: 10 },
            { time: '06:30 PM - 07:00 PM', type: 'Evening', capacity: 10 },
        ];

        await Slot.insertMany([...morningSlots, ...eveningSlots]);
        console.log('Slots seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding slots:', error);
        process.exit(1);
    }
};

seedSlots();

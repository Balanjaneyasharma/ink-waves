import mongoose from "mongoose";

import { config } from ".";

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Database already connected');
        return;
    }
    try {
        await mongoose.connect(config.mongoUri as string);
        console.log('Database Connected');
        console.log('Mongoose readyState:', mongoose.connection.readyState);

    }
    catch (err) {
        console.error('failed to connect db with error', err);
        throw err;
    }
}
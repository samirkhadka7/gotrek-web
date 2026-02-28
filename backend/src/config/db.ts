import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const CONNECTION_STRING = process.env.MONGODB_URI;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(CONNECTION_STRING!);
    console.log('Mongodb connected');
  } catch (err) {
    console.log('Database Error', err);
  }
};

export default connectDB;

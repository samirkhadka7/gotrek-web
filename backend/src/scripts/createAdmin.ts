import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import User from '../models/user.model';

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.argv[2];
    if (!email) {
      console.error('Usage: npm run create-admin <email>');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${user.name} (${user.email}) is now an admin`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

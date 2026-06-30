import mongoose from 'mongoose';
import { env } from './env.js';
import { WorkCategory } from '../models/WorkCategory.js';

const defaultCategories = [
  { name: 'plumber', label: 'Plumbing', iconName: 'FaWrench', iconColor: 'blue' },
  { name: 'electrician', label: 'Electrical', iconName: 'FaBolt', iconColor: 'amber' },
  { name: 'carpenter', label: 'Carpentry', iconName: 'FaHammer', iconColor: 'orange' },
  { name: 'painter', label: 'Painting', iconName: 'FaPaintRoller', iconColor: 'pink' },
  { name: 'ac technician', label: 'AC Service', iconName: 'FaFan', iconColor: 'cyan' },
  { name: 'mechanic', label: 'Mechanical', iconName: 'FaCar', iconColor: 'red' },
  { name: 'gardener', label: 'Gardening', iconName: 'FaTree', iconColor: 'emerald' },
  { name: 'cleaner', label: 'Cleaning', iconName: 'FaBroom', iconColor: 'purple' },
];

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default categories if collection is empty
    const count = await WorkCategory.countDocuments();
    if (count === 0) {
      await WorkCategory.insertMany(defaultCategories);
      console.log('Seeded default work categories successfully.');
    }
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import { Review } from './src/models/Review.js';

const dropIndex = async () => {
  try {
    console.log('Connecting to DB...', env.mongodbUri);
    await mongoose.connect(env.mongodbUri!);
    console.log('Connected.');

    // Drop the unique index on workerId_1_customerId_1 if it exists
    await Review.collection.dropIndex('workerId_1_customerId_1').catch(err => console.log('Index might not exist or already dropped', err.message));
    
    console.log('Index workerId_1_customerId_1 dropped successfully (or did not exist).');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropIndex();

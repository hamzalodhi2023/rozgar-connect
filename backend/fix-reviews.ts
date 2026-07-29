import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import { Job } from './src/models/Job.js';
import { Review } from './src/models/Review.js';

const fixReviews = async () => {
  try {
    console.log('Connecting to DB...', env.mongodbUri);
    await mongoose.connect(env.mongodbUri!);
    console.log('Connected.');

    const reviews = await Review.find();
    console.log(`Found ${reviews.length} reviews.`);

    for (const review of reviews) {
      await Job.findByIdAndUpdate(review.jobId, { isReviewed: true });
      console.log(`Updated job ${review.jobId}`);
    }

    console.log('Done fixing jobs.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixReviews();

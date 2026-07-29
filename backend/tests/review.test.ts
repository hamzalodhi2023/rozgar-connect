import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { WorkerProfile } from '../src/models/WorkerProfile.js';
import { Job } from '../src/models/Job.js';
import { Review } from '../src/models/Review.js';

describe('Reviews API', () => {
  let customerCookie: string;
  let workerCookie: string;
  let workerUserId: string;
  let completedJobId: string;

  beforeEach(async () => {
    // 1. Register Customer
    const custRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Customer', email: 'cust@test.com', password: 'password123', role: 'customer' });
    customerCookie = custRes.headers['set-cookie'][0];

    // 2. Register Worker
    const workRes = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Worker', email: 'work@test.com', password: 'password123', role: 'worker' });
    workerCookie = workRes.headers['set-cookie'][0];
    workerUserId = workRes.body.data.user.id;

    // 3. Create Worker Profile
    await request(app)
      .post('/api/v1/workers')
      .set('Cookie', workerCookie)
      .send({ categories: ['cleaner'], city: 'Isb', area: 'F8', phone: '123' });
    await WorkerProfile.findOneAndUpdate({ userId: workerUserId }, { verificationStatus: 'verified' });

    // 4. Create and Complete a Job
    const jobRes = await request(app)
      .post('/api/v1/jobs')
      .set('Cookie', customerCookie)
      .send({ workerId: workerUserId, description: 'Clean house' });
    completedJobId = jobRes.body.data.job._id;

    await Job.findByIdAndUpdate(completedJobId, { status: 'completed' });
  });

  it('customer should be able to write a review for a completed job', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', customerCookie)
      .send({
        jobId: completedJobId,
        rating: 5,
        comment: 'Great job!'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.review.rating).toBe(5);

    // Verify job is marked as reviewed
    const job = await Job.findById(completedJobId);
    expect(job?.isReviewed).toBe(true);
    
    // Verify worker profile average rating updated
    const profile = await WorkerProfile.findOne({ userId: workerUserId });
    expect(profile?.averageRating).toBe(5);
    expect(profile?.reviewCount).toBe(1);
  });

  it('customer should NOT be able to review the same job twice', async () => {
    // First review
    await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', customerCookie)
      .send({ jobId: completedJobId, rating: 5, comment: 'First' });

    // Second review
    const res2 = await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', customerCookie)
      .send({ jobId: completedJobId, rating: 4, comment: 'Second' });

    expect(res2.status).toBe(400); // Duplicate key error handled by middleware
  });

  it('customer should be able to review the same worker for a DIFFERENT job', async () => {
    // First job review
    await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', customerCookie)
      .send({ jobId: completedJobId, rating: 4, comment: 'First job' });

    // Create second job
    const job2Res = await request(app)
      .post('/api/v1/jobs')
      .set('Cookie', customerCookie)
      .send({ workerId: workerUserId, description: 'Clean again' });
    const jobId2 = job2Res.body.data.job._id;
    await Job.findByIdAndUpdate(jobId2, { status: 'completed' });

    // Second job review
    const res2 = await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', customerCookie)
      .send({ jobId: jobId2, rating: 5, comment: 'Second job' });

    expect(res2.status).toBe(201);

    const profile = await WorkerProfile.findOne({ userId: workerUserId });
    expect(profile?.averageRating).toBe(4.5); // (4 + 5) / 2
    expect(profile?.reviewCount).toBe(2);
  });
});

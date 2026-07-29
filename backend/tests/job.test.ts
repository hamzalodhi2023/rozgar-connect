import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { WorkerProfile } from '../src/models/WorkerProfile.js';
import { Job } from '../src/models/Job.js';

describe('Jobs API', () => {
  let customerCookie: string;
  let workerCookie: string;
  let workerUserId: string;

  beforeEach(async () => {
    // 1. Register Customer
    const custRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer'
      });
    customerCookie = custRes.headers['set-cookie'][0];

    // 2. Register Worker
    const workRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Worker',
        email: 'worker@example.com',
        password: 'password123',
        role: 'worker'
      });
    workerCookie = workRes.headers['set-cookie'][0];
    workerUserId = workRes.body.data.user.id;

    // 3. Create Worker Profile
    await request(app)
      .post('/api/v1/workers')
      .set('Cookie', workerCookie)
      .send({ categories: ['plumber'], city: 'Islamabad', area: 'Blue Area', phone: '123456789' });
      
    await WorkerProfile.findOneAndUpdate({ userId: workerUserId }, { verificationStatus: 'verified' });
  });

  it('customer should be able to create a job', async () => {
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Cookie', customerCookie)
      .send({
        workerId: workerUserId,
        description: 'Need my sink fixed'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.job.status).toBe('pending');
    expect(res.body.data.job.customerId).toBeDefined();
  });

  it('worker should be able to accept a job and complete it', async () => {
    // Create Job
    const jobRes = await request(app)
      .post('/api/v1/jobs')
      .set('Cookie', customerCookie)
      .send({ workerId: workerUserId, description: 'Fix sink' });
      
    const jobId = jobRes.body.data.job._id;

    // Worker Accepts Job
    const acceptRes = await request(app)
      .patch(`/api/v1/jobs/${jobId}/status`)
      .set('Cookie', workerCookie)
      .send({ status: 'accepted' });
      
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.data.job.status).toBe('accepted');

    // Worker Starts Job
    const progressRes = await request(app)
      .patch(`/api/v1/jobs/${jobId}/status`)
      .set('Cookie', workerCookie)
      .send({ status: 'in-progress' });
      
    expect(progressRes.body.data.job.status).toBe('in-progress');

    // Worker Marks as Completed
    const workerCompleteRes = await request(app)
      .patch(`/api/v1/jobs/${jobId}/status`)
      .set('Cookie', workerCookie)
      .send({ status: 'worker-completed' });
      
    expect(workerCompleteRes.body.data.job.status).toBe('worker-completed');

    // Customer Confirms Completion
    const custCompleteRes = await request(app)
      .patch(`/api/v1/jobs/${jobId}/status`)
      .set('Cookie', customerCookie)
      .send({ status: 'completed' });
      
    expect(custCompleteRes.body.data.job.status).toBe('completed');
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { WorkerProfile } from '../src/models/WorkerProfile.js';

describe('Worker Profile API', () => {
  let authCookie: string;
  let workerUserId: string;

  beforeEach(async () => {
    // 1. Register a user with 'worker' role
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Worker',
        email: 'worker@example.com',
        password: 'password123',
        role: 'worker'
      });
      
    authCookie = res.headers['set-cookie'][0];
    workerUserId = res.body.data.user.id;
  });

  it('should create a new worker profile successfully', async () => {
    const res = await request(app)
      .post('/api/v1/workers')
      .set('Cookie', authCookie)
      .send({
        categories: ['plumber'],
        city: 'Islamabad',
        area: 'Blue Area',
        phone: '+923001234567',
        whatsapp: '+923001234567',
        description: 'Expert plumber with 5 years experience.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.verificationStatus).toBe('unverified');
  });

  it('should not allow non-workers to create a profile', async () => {
    // Register a customer
    const custRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test Customer',
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer'
      });
    const custCookie = custRes.headers['set-cookie'][0];

    const res = await request(app)
      .post('/api/v1/workers')
      .set('Cookie', custCookie)
      .send({
        categories: ['plumber'],
        city: 'Islamabad',
        area: 'Blue Area',
        phone: '+923001234567',
        whatsapp: '+923001234567',
        description: 'Test'
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('search should only return verified workers', async () => {
    // Create profile
    await request(app)
      .post('/api/v1/workers')
      .set('Cookie', authCookie)
      .send({
        categories: ['plumber'],
        city: 'Islamabad',
        area: 'Blue Area',
        phone: '+923001234567'
      });

    // Search workers (should return empty since verificationStatus is unverified)
    const searchResUnverified = await request(app)
      .get('/api/v1/workers/search?category=plumber');
      
    expect(searchResUnverified.status).toBe(200);
    expect(searchResUnverified.body.data.workers.length).toBe(0);

    // Manually verify the worker in DB
    await WorkerProfile.findOneAndUpdate({ userId: workerUserId }, { verificationStatus: 'verified' });

    // Search workers again (should return 1)
    const searchResVerified = await request(app)
      .get('/api/v1/workers/search?category=plumber');
      
    expect(searchResVerified.status).toBe(200);
    expect(searchResVerified.body.data.workers.length).toBe(1);
    expect(searchResVerified.body.data.workers[0].userId.name).toBe('Test Worker');
  });
});

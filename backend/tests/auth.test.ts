import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should fail to register with an existing email', async () => {
    // 1. Register first
    await request(app).post('/api/v1/auth/register').send(testUser);
    
    // 2. Register again
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login successfully with correct credentials', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail to login with incorrect password', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should logout successfully', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
  });
});

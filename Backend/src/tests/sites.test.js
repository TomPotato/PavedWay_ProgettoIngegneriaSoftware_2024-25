const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Site } = require('../models/Site');
const { createTestSites } = require('../utils/createTest');


beforeAll(async () => {
  const uri = process.env.DB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(uri, {
    dbName: process.env.DB_TEST || 'test',
    useNewUrlParser: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});

let testSites = [];
beforeAll(async () => {
  testSites = await createTestSites(10);
});

var token = jwt.sign(
  { userId: 'testUserId', role: 'admin' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);


// Test for the GET /api/v1/sites endpoint
describe('GET /api/v1/sites', () => {

  beforeAll(async () => {
    await Site.deleteMany({});
    for (const site of testSites) {
      const res = await request(app)
        .post('/api/v1/sites')
        .set('X-API-Key', token)
        .send({ ...site });
    }
  });

  // User story: Read Sites
  test('should return 200 with no query params', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Cantiere ${i + 1}`);
    }
  }, 20000);

  test('should return 200 with offset and limit', async () => {
    const offset = 3;
    const limit = 5;    

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset, limit})
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Cantiere ${offset + i + 1}`);
    }
  }, 20000);

  test('should return 200 with limit only', async () => {
    const limit = 5;

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ limit: 5 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Cantiere ${i + 1}`);
    }
  }, 20000);

  test('should return 200 with offset only', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset: 2 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Cantiere ${offset + i + 1}`);
    }
  }, 20000);

  // User story: Read Current Events
  test('should return 200 with current sites', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ now: true })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Cantiere ${i + 1}`);
      expect(new Date(res.body[i].duration.start) <= new Date()).toBe(true);
      expect(new Date(res.body[i].duration.end) >= new Date()).toBe(true);
    }
  });

  test('should return 400 for inserting both <now> and <date>', async () => {
    await request(app)
      .get('/api/v1/sites')
      .query({ now: true, date: '2025-07-17T00:00:00.000+00:00' })
      .expect(400);
  });

  test('should return 400 for invalid date format', async () => {
    await request(app)
      .get('/api/v1/sites')
      .query({ now: true, date: '05-21-2025' })
      .expect(400);
  });
});
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { createTestReports } = require('../utils/createTest');

beforeAll(async () => {
  const uri = process.env.DB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(uri, {
    dbName: process.env.DB_TEST || 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});


// Test suite for the app module
test('app module should be defined', () => {
    expect(app).toBeDefined();
});

test('GET / should return 404', async () => {
  await request(app)
    .get('/')
    .expect(404);
});

test('GET /api/v1 should return 404', async () => {
  await request(app)
    .get('/api/v1')
    .expect(404);
});


// Test for the GET /api/v1/reports endpoint
describe('GET /api/v1/reports', () => {

  beforeAll(async () => {
    await createTestReports(10);
  });

  // User strory: Read Reports
  test('should return 200 with no query params', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Segnalazione ${i + 1}`);
    }
  }, 20000);

  test('should return 200 with offset and limit', async () => {
    const offset = 2;
    const limit = 4;

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ offset, limit })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(limit);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Segnalazione ${offset + i + 1}`);
    }
  }, 20000);

  test('should return 200 with limit only', async () => {
    const limit = 4;

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ limit})
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(limit);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Segnalazione ${i + 1}`);
    }
  }, 20000);

  test('should return 200 with offset only', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .query({ offset: 2 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Segnalazione ${offset + i + 1}`);
    }
  }, 20000);


  // User story: Read Current Events
  test('should return 200 with current reports', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .query({ now: true })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(res.body[i].name).toBe(`Segnalazione ${i + 1}`);
      expect(new Date(res.body[i].duration.start) <= new Date()).toBe(true);
      expect(new Date(res.body[i].duration.end) >= new Date()).toBe(true);
    }
  });

  test('should return 400 for inserting both <now> and <date>', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ now: true, date: '2025-05-31T12:56:46.180+00:00' })
      .expect(400);
  });

  test('should return 400 for invalid date format', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ now: true, date: '13/09/2025' })
      .expect(400);
  });
});
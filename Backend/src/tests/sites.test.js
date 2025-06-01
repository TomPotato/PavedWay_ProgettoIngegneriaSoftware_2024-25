const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { Sites } = require('../models/Site');

beforeAll(async () => {
  const uri = process.env.DB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || 'test',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});


// Test for the GET /api/v1/sites endpoint
describe('GET /api/v1/sites', () => {
  test('should return 200 with no query params', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  }, 20000);

  test('should return 200 with offset and limit', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset: 3, limit: 5 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);

  test('should return 200 with limit only', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ limit: 5 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
  }, 20000);

  test('should return 200 with offset only', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset: 2 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);
});
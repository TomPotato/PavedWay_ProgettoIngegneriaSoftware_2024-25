const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { createTestSites } = require('../utils/createTest');


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


// Test for the GET /api/v1/sites endpoint
describe('GET /api/v1/sites', () => {

  beforeAll(async () => {
    await createTestSites(10);
  });
  
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
});
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

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
  test('should return 200 with no query params', async () => {
    await request(app)
      .get('/api/v1/reports')
      .expect(200);
  }, 20000);

  test('should return 200 with offset and limit', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ offset: 2, limit: 4 })
      .expect(200);
  }, 20000);

  test('should return 200 with limit only', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ limit: 4 })
      .expect(200);
  }, 20000);

  test('should return 200 with offset only', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ offset: 2 })
      .expect(200);
  }, 20000);
});
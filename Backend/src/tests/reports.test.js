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


// Test for the /api/v1/reports endpoint
test('GET /api/v1/reports should return 200', async () => {
  await request(app)
    .get('/api/v1/reports')
    .expect(200);
}, 20000);
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Report } = require('../models/Report');
const { createTestReports } = require('../utils/createTest');

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

//Modelli dei report NON nel database
let testReports = []; 
beforeAll(async () => {
  testReports = await createTestReports(10);
  await Report.deleteMany({});
});

//Report creati nel database (compreso l'ID generato da MongoDB)
const createdReports = [];


const userId = new mongoose.Types.ObjectId().toHexString();
var tokenAdmin = jwt.sign(
  { id: userId, role: 'admin' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);


//Test for the POST /api/v1/reports endpoint
describe('POST /api/v1/reports', () => {

  // User story: Create Report
  test('should return 201 with valid report data', async () => {
    const report = testReports[0];

    const res = await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenAdmin)
      .send({ ...report })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(report.name);
    expect(res.body.description).toBe(report.description);
  });

  test('should return 401 for missing API key', async () => {
    const report = testReports[1];

    await request(app)
      .post('/api/v1/reports')
      .send({ ...report })
      .expect(401);
  });

  test('should return 400 for missing required report', async () => {
    await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenAdmin)
      .expect(400);
  });

  test('should return 400 for missing required fields', async () => {
    await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenAdmin)
      .send({
        description: testReports[1].description,
        location: testReports[1].location,
        duration: testReports[1].duration,
      })
      .expect(400);
  });

  test('should return 400 for invalid format', async () => {
    await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenAdmin)
      .send({
        name: testReports[1].name,
        description: testReports[1].description,
        location: testReports[1].location,
        duration: {
          start: 'startDate',
          end: 'endDate',
        },
      })
      .expect(400);
  });
});

// Test for the GET /api/v1/reports endpoint
describe('GET /api/v1/reports', () => {

  beforeAll(async () => {
    await Report.deleteMany({});
    for (const report of testReports) {
      const res = await request(app)
        .post('/api/v1/reports')
        .set('X-API-Key', tokenAdmin)
        .send({ ...report });

        createdReports.push(res.body);
    }
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

  // User story: Read Report Info
  test('should return 200 with a specific report by ID', async () => {
    const firstReportId = createdReports[0].id;
    const res = await request(app)
      .get(`/api/v1/reports/${firstReportId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.name).toBe('Segnalazione 1');
  });

  test('should return 404 for non-existent report ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/v1/reports/${nonExistentId}`)
      .expect(404);
  });
});
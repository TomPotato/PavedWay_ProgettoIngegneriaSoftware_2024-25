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
  });
});
afterAll(async () => {
  await mongoose.connection.close();
});

//Modelli dei sites NON nel database
let testSites = [];
beforeAll(async () => {
  testSites = await createTestSites(10);
  await Site.deleteMany({});
});
//Sites creati nel database (compreso l'ID generato da MongoDB)
const createdSites = [];

var tokenAdmin = jwt.sign(
  { userId: 'testUserId', role: 'admin' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);
var tokenCitizen = jwt.sign(
  { userId: 'testUserId2', role: 'citizen' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);




// Test for the POST /api/v1/sites endpoint
describe('POST /api/v1/sites', () => {

  // User story: Create Site
  test('should return 201 with valid site data', async () => {
    const site = testSites[0];

    const res = await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenAdmin)
      .send({ ...site })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(site.name);
    expect(res.body.info).toBe(site.info);
  });

  test('should return 403 for unauthorized user', async () => {
    const site = testSites[1];

    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenCitizen)
      .send({ ...site })
      .expect(403);
  });

  test('should return 401 for missing API key', async () => {
    const site = testSites[1];

    await request(app)
      .post('/api/v1/sites')
      .send({ ...site })
      .expect(401);
  });

  test('should return 400 for missing required site', async () => {
    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenAdmin)
      .expect(400);
  });

  test('should return 400 for missing required fields', async () => {
    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenAdmin)
      .send({
        info: testSites[1].info,
        location: testSites[1].location,
        duration: testSites[1].duration,
      })
      .expect(400);
  });

  test('should return 400 for invalid format', async () => {
    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenAdmin)
      .send({
        name: testSites[1].name,
        info: testSites[1].info,
        location: testSites[1].location,
        duration: {
          start: 'startDate',
          end: 'endDate',
        },
      })
      .expect(400);
  });
});





// Test for the GET /api/v1/sites endpoint
describe('GET /api/v1/sites', () => {

  beforeAll(async () => {
    await Site.deleteMany({});
    for (const site of testSites) {
      const res = await request(app)
        .post('/api/v1/sites')
        .set('X-API-Key', tokenAdmin)
        .send({ ...site });

        createdSites.push(res.body);
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




// Test for the PATCH /api/v1/sites/:id endpoint
describe('PATCH /api/v1/sites/:id', () => {

  
  // User story: Update Site
  test('should return 200 with valid site data', async () => {
    const firstSiteId = createdSites[0].id;

    const updatedData = {
      name: 'Updated Cantiere',
      info: 'Updated Info',
    };

    const res = await request(app)
      .patch(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedData)
      .expect(200);

    expect(res.body).toHaveProperty('id', firstSiteId);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.info).toBe(updatedData.info);
  });

  test('should return 400 for wrong data format', async () => {
    const firstSiteId = createdSites[0].id;
    const updatedData = {
      name: 'Updated Cantiere',
      info: 'Updated Info',
      duration: {
        start: 'invalidDate',
        end: 'invalidDate',
      },
    };

    await request(app)
      .patch(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedData)
      .expect(400);
  });

  test('should return 403 for unauthorized user', async () => {
    const firstSiteId = createdSites[0].id;

    const updatedData = {
      name: 'Updated Cantiere',
      info: 'Updated Info',
    };

    await request(app)
      .patch(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenCitizen)
      .send(updatedData)
      .expect(403);
  });

  test('should return 401 for missing API key', async () => {
    const firstSiteId = testSites[0].id;
    const updatedData = {
      name: 'Updated Cantiere',
      info: 'Updated Info',
    };

    await request(app)
      .patch(`/api/v1/sites/${firstSiteId}`)
      .send(updatedData)
      .expect(401);
  });

  test('should return 404 for non-existent site ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = {
      name: 'Updated Cantiere',
      info: 'Updated Info',
    };

    await request(app)
      .patch(`/api/v1/sites/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedData)
      .expect(404);
  });
});



// Test for the DELETE /api/v1/sites/:id endpoint 
describe('DELETE /api/v1/sites/:id', () => {

  // User story: Delete Site
  test('should return 204 for successful deletion', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(204);

    const res = await request(app)
      .get(`/api/v1/sites/${firstSiteId}`)
      .expect(404);
  });

  test('should return 403 for unauthorized user', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenCitizen)
      .expect(403);
  });

  test('should return 401 for missing API key', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .expect(401);
  });

  test('should return 404 for non-existent site ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/v1/sites/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(404);
  });
});
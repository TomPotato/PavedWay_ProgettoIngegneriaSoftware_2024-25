const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const db = require('../src/database/DatabaseClient');
const app = require('../src/app');
const { User } = require('../src/models/User');
const { createTestUsers } = require('../src/utils/createTest');

beforeAll(async () => {
  await db.connect(process.env.DB_TEST);
});

afterAll(async () => {
  await db.disconnect();
});

//Modelli di admin e citizens NON nel database
let testAdmins = [];
let testCitizens = [];
beforeAll(async () => {
  testAdmins = await createTestUsers(5, 'admin');
  testCitizens = await createTestUsers(10, 'citizen');
});
//Users creati nel database (compreso l'ID generato da MongoDB)
const createdAdmins = [];
const createdCitizens = [];

const adminId = new mongoose.Types.ObjectId().toHexString();
const citizenId = new mongoose.Types.ObjectId().toHexString();
var tokenAdmin = jwt.sign(
  { id: adminId, role: 'admin' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);
var tokenCitizen = jwt.sign(
  { id: citizenId, role: 'citizen' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);



// Test for the POST /api/v1/authentication endpoint
describe('POST /api/v1/authentication', () => {

  //   beforeAll(async () => {
  //     await User.deleteMany({});
  //     for (const admin of testAdmins) {
  //       const res = await request(app)
  //         .post('/api/v1/users')
  //         .set('X-API-Key', tokenAdmin)
  //         .send({ ...admin });

  //         createdAdmins.push(res.body);
  //     }
  //     for (const citizen of testCitizens) {
  //       const res = await request(app)
  //         .post('/api/v1/users')
  //         .set('X-API-Key', tokenCitizen)
  //         .send({ ...citizen });

  //         createdCitizens.push(res.body);
  //     }
  //   });

  //User story: Log In
  test('should return 200 with valid credentials', async () => {
    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({ ...testAdmins[1], role: 'admin' });

    const res = await request(app)
      .post('/api/v1/authentication')
      .send({
        username: testAdmins[1].username,
        password: testAdmins[1].password
      })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  test('should return 401 for invalid username', async () => {
    await request(app)
      .post('/api/v1/authentication')
      .send({
        username: 'wrongUsername',
        password: testAdmins[1].password
      })
      .expect(401);
  });

  test('should return 401 for invalid password', async () => {
    await request(app)
      .post('/api/v1/authentication')
      .send({
        username: testAdmins[1].username,
        password: 'wrongPassword'
      })
      .expect(401);
  });

  test('should return 400 for missing fields', async () => {
    await request(app)
      .post('/api/v1/authentication')
      .expect(400);
  });

  test('should return 400 for missing password', async () => {
    await request(app)
      .post('/api/v1/authentication')
      .send({
        username: testAdmins[1].username
      })
      .expect(400);
  });

  test('should return 400 for missing username', async () => {
    await request(app)
      .post('/api/v1/authentication')
      .send({
        password: testAdmins[1].password
      })
      .expect(400);
  });
});
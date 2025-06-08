const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../models/User');
const { createTestUsers } = require('../utils/createTest');

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

//Modelli di admin NON nel database
let testAdmins = [];
let testCitizens = [];
beforeAll(async () => {
  testAdmins = await createTestUsers(2, 'admin');
  testCitizens = await createTestUsers(5, 'citizen');
  await User.deleteMany({});
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


//Test for the POST /api/v1/users endpoint
describe('POST /api/v1/users', () => {

  // User story: Create Admin
  test('should return 201 with valid admin data', async () => {
    const admin = testAdmins[0];

    const res = await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({ ...admin, role: 'admin' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(admin.username);
    expect(res.body.role).toBe('admin');
  });

  test('should return 403 for citizen trying to create admin', async () => {
    const admin = testAdmins[1];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenCitizen)
      .send({ ...admin, role: 'admin' })
      .expect(403);
  });

//   test('should return 401 for missing API key', async () => {
//     const admin = testAdmins[1];

//     await request(app)
//       .post('/api/v1/users')
//       .send({ ...admin, role: 'admin' })
//       .expect(401);
//   });

  test('should return 400 for missing required fields', async () => {
    const admin = testAdmins[1];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({ ...admin, role: 'admin', username: undefined })
      .expect(400);
  });

  test('should return 400 for empty request body', async () => {
    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({})
      .expect(400);
  });

  test('should return 409 for username already exists', async () => {
    const admin = testAdmins[0];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({ ...admin, role: 'admin' })
      .expect(409);
  });

  test('should return 400 for invalid role', async () => {
    const admin = testAdmins[1];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenAdmin)
      .send({ ...admin, role: 'invalid_role' })
      .expect(400);
  });

  // User story: Register
  test('should return 201 with valid citizen data', async () => {
    const citizen = testCitizens[0];

    const res = await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenCitizen)
      .send({ ...citizen, role: 'citizen' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(citizen.username);
    expect(res.body.role).toBe('citizen');
  });

  test('should return 409 for mail already exists', async () => {
    const citizen = testCitizens[0];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenCitizen)
      .send({ ...citizen, role: 'citizen' })
      .expect(409);
  });

  test('should return 400 for missing required fields', async () => {
    const citizen = testCitizens[1];

    await request(app)
      .post('/api/v1/users')
      .set('X-API-Key', tokenCitizen)
      .send({ ...citizen, role: 'citizen', username: undefined })
      .expect(400);
  });

  test('should return 400 for invalid username', async () => {
    const citizen = testCitizens[1];
    await request(app)
      .post('/api/v1/users')
      .send({...citizen, role: 'citizen', username: 'paved_way1!'})
      .expect(400);
  });

  test('should return 400 for invalid name', async () => {
    const citizen = testCitizens[1];
    await request(app)
      .post('/api/v1/users')
      .send({...citizen, role: 'citizen', name: 'Paved!'})
      .expect(400);
  });

  test('should return 400 for invalid surname', async () => {
    const citizen = testCitizens[1];
    await request(app)
      .post('/api/v1/users')
      .send({...citizen, role: 'citizen', surname: 'Way!'})
      .expect(400);
  });

  test('should return 400 for invalid password', async () => {
    const citizen = testCitizens[1];
    await request(app)
      .post('/api/v1/users')
      .send({...citizen, role: 'citizen', password: 'password'})
      .expect(400);
  });

  test('should return 400 for invalid email', async () => {
    const citizen = testCitizens[1];
    await request(app)
      .post('/api/v1/users')
      .send({...citizen, role: 'citizen', email: 'paved-way'})
      .expect(400);
  });

});
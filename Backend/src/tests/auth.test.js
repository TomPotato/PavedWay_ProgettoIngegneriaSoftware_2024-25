const request = require('supertest');
const app = require('../app');
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

// Test for the POST /api/v1/auth endpoint
describe('POST /api/v1/auth', () => {

  beforeAll(async () => {
    await User.deleteMany({});
  });

  let testUsers = [];
  beforeAll(async () => {
    testUsers = await createTestUsers(2);
  });

  // User strory: Register
  test('should return 201 with valid credentials', async () => {

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...testUsers[0] })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body).toHaveProperty('user');

    createdUserId = res.body.user._id;
  });

  test('should return 409 for duplicate email', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: testUsers[1].username,
        name: testUsers[1].name,
        surname: testUsers[1].surname,
        password: testUsers[1].password,
        email: testUsers[0].email
      })
      .expect(409);
  });

  test('should return 400 for missing fields', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: testUsers[1].name,
        surname: testUsers[1].surname,
        password: testUsers[1].password,
        email: testUsers[1].email
      })
      .expect(400);
  });

  test('should return 400 for invalid username', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: "paved_way1!",
        name: testUsers[1].name,
        surname: testUsers[1].surname,
        password: testUsers[1].password,
        email: testUsers[1].email
      })
      .expect(400);
  });

  test('should return 400 for invalid name', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: testUsers[1].username,
        name: "Paved!",
        surname: testUsers[1].surname,
        password: testUsers[1].password,
        email: testUsers[1].email
      })
      .expect(400);
  });

  test('should return 400 for invalid surname', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: testUsers[1].username,
        name: testUsers[1].name,
        surname: "Way!",
        password: testUsers[1].password,
        email: testUsers[1].email
      })
      .expect(400);
  });

  test('should return 400 for invalid password', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: testUsers[1].username,
        name: testUsers[1].name,
        surname: testUsers[1].surname,
        password: "password",
        email: testUsers[1].email
      })
      .expect(400);
  });
  
  test('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: testUsers[1].username,
        name: testUsers[1].name,
        surname: testUsers[1].surname,
        password: testUsers[1].password,
        email: "paved-way"
      })
      .expect(400);
  });
});
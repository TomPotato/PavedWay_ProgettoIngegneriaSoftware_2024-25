const request = require('supertest');
const app = require('../app'); 

describe('API /api/v1/reports', () => {

  it('GET /api/v1/reports dovrebbe restituire una lista di segnalazioni', async () => {
    const response = await request(app).get('/api/v1/reports');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/v1/reports/:id con ID inesistente restituisce 404', async () => {
    const fakeId = '64eac6b9cf4e2b001e3d1234'; // id finto
    const response = await request(app).get(`/api/v1/reports/${fakeId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('code', 404);
  });

});
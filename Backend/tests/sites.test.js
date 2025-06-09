const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/DatabaseClient');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Site } = require('../src/models/Site');
const { createTestSites } = require('../src/utils/createTest');

beforeAll(async () => {
  await db.connect(process.env.DB_TEST);
});

afterAll(async () => {
  await db.disconnect();
});

//Modelli dei sites NON nel database
let testSites = [];
beforeAll(async () => {
  testSites = await createTestSites(10);
});
//Sites creati nel database (compreso l'ID generato da MongoDB)
const createdSites = [];

var tokenAdmin = jwt.sign(
  { id: 'testUserId', role: 'admin' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);

var tokenCitizen = jwt.sign(
  { id: 'testUserId2', role: 'citizen' },
  process.env.JWT_SECRET || 'your_jwt_secret',
  { expiresIn: '1h' }
);

// User story 4: Create Site
describe('User story 4: Create Site', () => {

  test('9: Creazione di un cantiere essendo autenticati come amministratore e fornendo un cantiere come parametro', async () => {
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

  test('10: Creazione di un cantiere senza essere autenticati come amministratore', async () => {
    const site = testSites[1];

    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenCitizen)
      .send({ ...site })
      .expect(403);
  });

  test('11: Creazione di un cantiere senza aver effettuato il log in', async () => {
    const site = testSites[1];

    await request(app)
      .post('/api/v1/sites')
      .send({ ...site })
      .expect(401);
  });

  test('12: Creazione di un cantiere senza fornire un cantiere come parametro', async () => {
    await request(app)
      .post('/api/v1/sites')
      .set('X-API-Key', tokenAdmin)
      .expect(400);
  });

  test('13: Creazione di un cantiere senza fornire alcuni parametri obbligatori', async () => {
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

  test('14: Creazione di un cantiere fornendo valori errati', async () => {
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





// User story 3: Read Sites
describe('User story 3: Read Sites', () => {

  beforeAll(async () => {
    for (const site of testSites) {
      const res = await request(app)
        .post('/api/v1/sites')
        .set('X-API-Key', tokenAdmin)
        .send({ ...site });

      createdSites.push(res.body);
    }
  });


  test('5: Lettura dei cantieri senza inserire offset e limit', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  }, 20000);

  test('6: Lettura dei cantieri inserendo offset e limit', async () => {
    const offset = 3;
    const limit = 5;

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset, limit })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);

  test('7: Lettura dei cantieri inserendo offset', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ offset: 2 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);

  test('8: Lettura dei cantieri inserendo limit', async () => {
    const limit = 5;

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ limit: 5 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(5);
  }, 20000);
});


// User story 6: Read Current Events
describe('User story 6: Read Current Events', () => {

  test('22: Lettura di un cantiere nel momento in cui si esegue il comando', async () => {
    const res = await request(app)
      .get('/api/v1/sites')
      .query({ now: true })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(new Date(res.body[i].duration.start) <= new Date()).toBe(true);
      expect(new Date(res.body[i].duration.end) >= new Date()).toBe(true);
    }
  });

  test('24: Lettura di un cantiere nel momento in cui si esegue il comando e gli si passa una data', async () => {
    await request(app)
      .get('/api/v1/sites')
      .query({ now: true, date: '2025-07-17T00:00:00.000+00:00' })
      .expect(400);
  });

  test('26: Lettura di un cantiere nel momento in cui si esegue il comando e gli si passa una data in formato non corretto', async () => {
    await request(app)
      .get('/api/v1/sites')
      .query({ now: true, date: '05-21-2025' })
      .expect(400);
  });
});


// User story 16: Search Event By Location
describe('User story 16: Search Event By Location', () => {

  test('70: Ricerca di un cantiere con coordinate e raggio validi', async () => {

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ latitude: 45.1, longitude: 9.1, radius: 500 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('72: Ricerca di un cantiere con coordinate non valide e raggio valido', async () => {

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ latitude: 90.1, longitude: 180.1, radius: 500 })
      .expect(400);
  });

  test('74: Ricerca di un cantiere con coordinate valide e raggio non valido', async () => {

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ latitude: 45.1, longitude: 9.1, radius: 5001 })
      .expect(400);
  });

  test('76: Ricerca di un cantiere con coordinate valide ma senza raggio', async () => {

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ latitude: 45.1, longitude: 9.1 })
      .expect(400);
  });

  test('78: Ricerca di un cantiere con raggio valido ma senza coordinate', async () => {

    const res = await request(app)
      .get('/api/v1/sites')
      .query({ radius: 500 })
      .expect(400);
  });
});





// User story 21: Comment Event
describe('User story 21: Comment Event', () => {

  test('90: Creazione di un commento su un cantiere esistente', async () => {
    const resGet = await request(app)
      .get(`/api/v1/sites`)
      .expect(200);
    const siteId = resGet.body[0].id;

    await request(app)
      .post(`/api/v1/sites/${siteId}/comments`)
      .set('X-API-Key', tokenAdmin)
      .send({ text: 'Commento1' })
      .expect(201);
  });

  test('92: Creazione di un commento su un cantiere non esistente', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/v1/sites/${nonExistentId}/comments`)
      .set('X-API-Key', tokenAdmin)
      .send({ text: 'Commento2' })
      .expect(404);
  });

  test('94: Creazione di un commento su un cantiere esistente ma senza autenticazione', async () => {
    const siteId = createdSites[1].id

    const res = await request(app)
      .post(`/api/v1/sites/${siteId}/comments`)
      .send({ text: 'Commento3' })
      .expect(401);
  });
});



// User story 8: Update Site
describe('User story 8: Update Site', () => {

  test('29: Modifica di un cantiere fornendo id e dati corretti ed essendo autenticati come amministratore', async () => {
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

  test('30: Modifica di un cantiere fornendo id corretto ma dati non validi', async () => {
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
  
  test('31: Modifica di un cantiere fornendo id non esistente ma dati corretti', async () => {
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

  test('32: Modifica di un cantiere fornendo id e dati corretti ma senza essere autenticati come amministratore', async () => {
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

  test('Modifica di un cantiere fornendo id e dati corretti ma senza aver effettuato il log in', async () => {
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
});




// User story 9: Delete Site
describe('User story 9: Delete Site', () => {

  test('33: Eliminazione di un cantiere fornendo un id corretto ed essendo autenticati come amministratore', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(204);

    const res = await request(app)
      .get(`/api/v1/sites/${firstSiteId}`)
      .expect(404);
  });

  test('Eliminazione di un cantiere fornendo un id corretto ma senza aver effettuato il log in', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .expect(401);
  });

  test('34: Eliminazione di un cantiere fornendo un id non valido', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/v1/sites/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(404);
  });

  test('35: Eliminazione di un cantiere fornendo un id corretto ma senza essere autenticati come amministratore', async () => {
    const firstSiteId = createdSites[0].id;

    await request(app)
      .delete(`/api/v1/sites/${firstSiteId}`)
      .set('X-API-Key', tokenCitizen)
      .expect(403);
  });
});
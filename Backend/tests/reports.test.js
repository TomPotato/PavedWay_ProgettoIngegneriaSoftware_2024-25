const request = require('supertest');
const db = require('../src/database/DatabaseClient');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Report } = require('../src/models/Report');
const { createTestReports } = require('../src/utils/createTest');

beforeAll(async () => {
  await db.connect(process.env.DB_TEST);
});

afterAll(async () => {
  await db.disconnect();
});

//Modelli dei report NON nel database
let testReports = [];
beforeAll(async () => {
  testReports = await createTestReports(10);
});

//Report creati nel database (compreso l'ID generato da MongoDB)
const createdReports = [];


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

// User story 11: Create Report
describe('User story 11: Create Report', () => {

  test('44: Creazione di una segnalazione avendo effettuato il log in e fornendo una segnalazione valida come parametro', async () => {
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

  test('45: Creazione di una segnalazione avendo effettuato il log in ma senza fornire una segnalazione come parametro', async () => {
    await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenAdmin)
      .expect(400);
  });

  test('46: Creazione di una segnalazione avendo effettuato il log in ma fornendo parametri non validi', async () => {
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

  test('47: Creazione di una segnaalzione avendo effettuato il log in ma senza fornire parametri ', async () => {
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

  test('48: Creazione di una segnalazione senza aver effettuato il log in', async () => {
    const report = testReports[1];

    await request(app)
      .post('/api/v1/reports')
      .send({ ...report })
      .expect(401);
  });

});






// User story 2: Read Reports
describe('User story 2: Read Reports', () => {

  beforeAll(async () => {
    for (const report of testReports) {
      const res = await request(app)
        .post('/api/v1/reports')
        .set('X-API-Key', tokenAdmin)
        .send({ ...report });

      createdReports.push(res.body);
    }
  });


  test('1: Lettura delle segnalazioni senza offset e limit', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  }, 20000);

  test('2: Lettura delle regnalazioni con offset e limit', async () => {
    const offset = 2;
    const limit = 4;

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ offset, limit })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(limit);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);

    test('3: Lettura delle regnalazioni con solo offset', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .query({ offset: 2 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  }, 20000);

  test('4: Lettura delle segnalazioni con solo limit', async () => {
    const limit = 4;

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ limit })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(limit);
  }, 20000);
});


// User story 6: Read Current Events
describe('User story 6: Read Current Events', () => {

  test('21: Lettura di una segnalazione nel momento in cui si esegue il comando', async () => {
    const res = await request(app)
      .get('/api/v1/reports')
      .query({ now: true })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);

    for (let i = 0; i < res.body.length; i++) {
      expect(new Date(res.body[i].duration.start) <= new Date()).toBe(true);
      expect(new Date(res.body[i].duration.end) >= new Date()).toBe(true);
    }
  });

  test('23: Lettura di una segnalazione nel momento in cui si esegue il comando e gli si passa una data', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ now: true, date: '2025-05-31T12:56:46.180+00:00' })
      .expect(400);
  });

  test('25: Lettura di una segnalazione nel momento in cui si esegue il comando e gli si passa una data in formato non corretto', async () => {
    await request(app)
      .get('/api/v1/reports')
      .query({ now: true, date: '13/09/2025' })
      .expect(400);
  });
});


// User story 7: Read Report Info
describe('User story 7: Read Report Info', () => {

  test('27: Lettura della segnalazione fornendo un id corretto', async () => {
    const firstReportId = createdReports[0].id;
    const res = await request(app)
      .get(`/api/v1/reports/${firstReportId}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });

  test('28: Lettura della segnalazione fornendo un id non valido', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .get(`/api/v1/reports/${nonExistentId}`)
      .expect(404);
  });
});


// User story 16: Search Event by Location
describe('User story 16: Search Event by Location', () => {

  test('71: Ricerca di una segnalazione con coordinate e raggio validi', async () => {

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ latitude: 45.1, longitude: 9.1, radius: 500 })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('73: Ricerca di una segnalazione con coordinate non valide e raggio valido', async () => {

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ latitude: 90.1, longitude: 180.1, radius: 500 })
      .expect(400);
  });

  test('75: Ricerca di una segnalazione con coordinate valide e raggio non valido', async () => {

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ latitude: 45.1, longitude: 9.1, radius: 5001 })
      .expect(400);
  });

  test('77: Ricerca di una segnalazione con coordinate valide ma senza raggio', async () => {

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ latitude: 45.1, longitude: 9.1 })
      .expect(400);
  });

  test('79: Ricerca di una segnalazione con raggio valido ma senza coordinate', async () => {

    const res = await request(app)
      .get('/api/v1/reports')
      .query({ radius: 500 })
      .expect(400);
  });
});






// User story 21: Comment Event
describe('User story 21: Comment Event', () => {

  test('91: Creazione di un commento su una segnalazione esistente', async () => {
    const reportId = createdReports[0].id

    const res = await request(app)
      .post(`/api/v1/reports/${reportId}/comments`)
      .set('X-API-Key', tokenAdmin)
      .send({ text: 'Commento1' })
      .expect(201);
  });

  test('93: Creazione di un commento su una segnalazione non esistente', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/v1/reports/${nonExistentId}/comments`)
      .set('X-API-Key', tokenAdmin)
      .send({ text: 'Commento2' })
      .expect(404);
  });

  test('95: Creazione di un commento su una segnalazione esistente ma senza autenticazione', async () => {
    const reportId = createdReports[1].id

    const res = await request(app)
      .post(`/api/v1/reports/${reportId}/comments`)
      .send({ text: 'Commento3' })
      .expect(401);
  });
});







// User story 12: Approve Report
describe('User story 12: Approve Report', () => {

  test('49: Approvazione di una segnalazione esistente', async () => {
    const reportId = createdReports[0].id;
    const updatedReport = {
      status: 'approved',
    };

    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedReport)
      .expect(204);
  });

  test('Approvazione di una segnalazione esistente senza aver effettuato il log in', async () => {
    const reportId = createdReports[1].id;
    const updatedReport = {
      description: 'Descrizione aggiornata',
    };

    await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .send(updatedReport)
      .expect(401);
  });

  test('Approvazione di una segnalazione esistente ma senza fornire i parametri richiesti', async () => {
    const reportId = createdReports[2].id;

    await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(400);
  });

  test('50: Approvazione di una segnalazione fornendo id non esistente', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedReport = {
      status: 'approved',
    };

    await request(app)
      .patch(`/api/v1/reports/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedReport)
      .expect(404);
  });

  test('51: Approvazione di una segnalazione fornendo id esistente ma dati sbagliati', async () => {
    const reportId = createdReports[3].id;

    await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .send({
        status: 'invalid_status',
      })
      .expect(400);
  });
});

// User story 17: Solve Report
describe('User story 17: Solve Report', () => {

  test('80: Modifica dello stato di una segnalazione esistente a "risolta"', async () => {
    const reportId = createdReports[1].id;
    const updatedReport = {
      status: 'solved',
    };

    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedReport)
      .expect(204);
  });

  test('81: Modifica dello stato di una segnalazione non esistente a "risolta"', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedReport = {
      status: 'solved',
    };

    await request(app)
      .patch(`/api/v1/reports/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedReport)
      .expect(404);
  });

  test('82: Modifica dello stato di una segnalazione esistente a "risolta" ma senza autenticazione', async () => {
    const reportId = createdReports[1].id;
    const updatedReport = {
      status: 'solved',
    };

    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .send(updatedReport)
      .expect(401);
  });

  test('83: Modifica di altri campi di una segnalazione esistente', async () => {
    const reportId = createdReports[1].id;
    const updatedReport = {
      name: 'Nuovo',
    };

    const res = await request(app)
      .patch(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .send(updatedReport)
      .expect(403);
  });
});



// User story 13: Admin Delete Report
describe('User story 13: Admin Delete Report', () => {

  test('52: Eliminazione di una segnalazione fornendo un id esistente', async () => {
    const reportId = createdReports[0].id;

    await request(app)
      .delete(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(204);
  });

  test('Eliminazione di una segnalazione fornendo un id esistente ma senza aver effettuato il log in', async () => {
    const reportId = createdReports[1].id;

    await request(app)
      .delete(`/api/v1/reports/${reportId}`)
      .expect(401);
  });

  test('53: Eliminazione di una segnalazione fornendo un id non esistente nel database', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/v1/reports/${nonExistentId}`)
      .set('X-API-Key', tokenAdmin)
      .expect(404);
  });

  test('54: Eliminazione di una segnalazione fornendo un id esistente ma non essendo autenticato', async () => {
    const reportId = createdReports[2].id;

    await request(app)
      .delete(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenCitizen)
      .expect(403);
  });
});


// User story 19: Delete Report
describe('User story 19: Delete Report', () => {

  test('66: Eliminazione di una segnalazione che é stata creata dall\'utente ed esiste', async () => {

    const report = testReports[0];
    const res = await request(app)
      .post('/api/v1/reports')
      .set('X-API-Key', tokenCitizen)
      .send({ ...report })
      .expect(201);

    await request(app)
      .delete(`/api/v1/reports/${res.body.id}`)
      .set('X-API-Key', tokenCitizen)
      .expect(204);
  });

  test('67: Eliminazione di una segnalazione con id non esistente', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/v1/reports/${nonExistentId}`)
      .set('X-API-Key', tokenCitizen)
      .expect(404);
  });

  test('68: Eliminazione di una segnalazione con id esistente ma che non é stata creata dall\'utente che la sta eliminando', async () => {
    const reportId = createdReports[1].id;

    await request(app)
      .delete(`/api/v1/reports/${reportId}`)
      .set('X-API-Key', tokenCitizen)
      .expect(403);
  });

  test('69: Eliminazione di una segnalazione con id esistente senza essere autenticato', async () => {
    const reportId = createdReports[1].id;

    await request(app)
      .delete(`/api/v1/reports/${reportId}`)
      .expect(401);
  });
});
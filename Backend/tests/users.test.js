const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/DatabaseClient');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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


// User story 15: Create Admin
describe('User story 15: Create Admin', () => {

	test('60: Creazione di un amministratore inserendo correttamente tutti i dati validi', async () => {
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

	test('65: Creazione di un amministratore inserendo i dati correttamente ma non essendo autenticato come amministratore', async () => {
		const admin = testAdmins[1];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenCitizen)
			.send({ ...admin, role: 'admin' })
			.expect(403);
	});

	test('62: Creazione di un amministratore con dati validi ma senza autenticazione', async () => {
		const admin = testAdmins[1];

		const res = await request(app)
			.post('/api/v1/users')
			.send({ ...admin, role: 'admin' })
			.expect(403);
	});

	test('64: Creazione di un amminstratore inserendo i dati incorrettamente (non del formato richiesto)', async () => {
		const admin = testAdmins[1];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.send({ ...admin, role: 'admin', username: undefined })
			.expect(400);
	});

	test('61: Creazione di un amministratore non inserendo peró nessun dato', async () => {
		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.send({})
			.expect(400);
	});

	test('63: Creazione di un amministratore inserendo i dati correttamente ma l\'username é giá in utilizzo', async () => {
		const admin = testAdmins[0];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.send({ ...admin, role: 'admin' })
			.expect(409);
	}, 20000);

	test('64: Creazione di un amminstratore inserendo i dati incorrettamente (non del formato richiesto)', async () => {
		const admin = testAdmins[1];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.send({ ...admin, role: 'invalid_role' })
			.expect(400);
	}, 20000);
});


// User story 10: Register
describe('User story 10: Register', () => {

	test('36: Registrazione di un nuovo utente fornendo nome utente, nome, cognome, password e email validi', async () => {
		const citizen = testCitizens[0];

		const res = await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenCitizen)
			.send({ ...citizen, role: 'citizen' })
			.expect(201);

		expect(res.body).toHaveProperty('id');
		expect(res.body.username).toBe(citizen.username);
		expect(res.body.role).toBe('citizen');
	}, 20000);

	test('37: Registrazione di un nuovo utente fornendo una email già in uso', async () => {
		const citizen = testCitizens[0];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenCitizen)
			.send({ ...citizen, role: 'citizen' })
			.expect(409);
	}, 20000);

	test('38: Registrazione di un utente fornendo dati incompleti', async () => {
		const citizen = testCitizens[1];

		await request(app)
			.post('/api/v1/users')
			.set('X-API-Key', tokenCitizen)
			.send({ ...citizen, role: 'citizen', username: undefined })
			.expect(400);
	}, 20000);

	test('39: Registrazione di un nuovo utente con nome utente non valido', async () => {
		const citizen = testCitizens[1];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen', username: 'paved_way1!' })
			.expect(400);
	}, 20000);

	test('40: Registrazione di un nuovo utente con nome non valido', async () => {
		const citizen = testCitizens[1];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen', name: 'Paved!' })
			.expect(400);
	}, 20000);

	test('41: Registrazione di un nuovo utente con cognome non valido', async () => {
		const citizen = testCitizens[1];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen', surname: 'Way!' })
			.expect(400);
	}, 20000);

	test('42: Registrazione di un nuovo utente con password non valida', async () => {
		const citizen = testCitizens[1];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen', password: 'password' })
			.expect(400);
	}, 20000);

	test('43: Registrazione di un nuovo utente con email non valida', async () => {
		const citizen = testCitizens[1];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen', email: 'paved-way' })
			.expect(400);
	}, 20000);
});

// User story 25: Delete User
describe('User story 25: Delete User', () => {
	test('96: Eliminazione del proprio profilo', async () => {
		const citizen = testCitizens[2];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen' })
			.expect(201);

		const res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: citizen.username, password: citizen.password })
			.expect(200);

		const token = res.body.token;
		const id = res.body.user.id;

		await request(app)
			.delete(`/api/v1/users/${id}`)
			.set('X-API-Key', token)
			.expect(204);
	}, 20000);

	test('97: Eliminazione del proprio profilo ma senza autenticazione', async () => {
		const citizen = testCitizens[3];
		await request(app)
			.post('/api/v1/users')
			.send({ ...citizen, role: 'citizen' })
			.expect(201);

		const res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: citizen.username, password: citizen.password })
			.expect(200);

		const id = res.body.user.id;

		await request(app)
			.delete(`/api/v1/users/${id}`)
			.expect(401);
	}, 20000);

	test('98: Eliminazione di un altro profilo', async () => {
		const citizen = testCitizens[3];
		const otherCitizen = testCitizens[4];
		await request(app)
			.post('/api/v1/users')
			.send({ ...otherCitizen, role: 'citizen' })
			.expect(201);

		let res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: citizen.username, password: citizen.password })
			.expect(200);

		const token = res.body.token;

		res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: otherCitizen.username, password: otherCitizen.password })
			.expect(200);

		const id = res.body.user.id;

		await request(app)
			.delete(`/api/v1/users/${id}`)
			.set('X-API-Key', token)
			.expect(403);
	}, 20000);

	test('99: Eliminazione dell\'ultimo amministratore', async () => {
		const admin = testAdmins[0];

		const res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: admin.username, password: admin.password })
			.expect(200);

		const token = res.body.token;
		const id = res.body.user.id;

		// Ottieni tutti gli admin
		const usersRes = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', token)
			.expect(200);

		const admins = usersRes.body.filter(u => u.role === 'admin');
		// Se ci sono più admin, elimina tutti gli altri admin tranne se stesso
		for (const adminUser of admins) {
			if (adminUser.id !== id) {
				await request(app)
					.delete(`/api/v1/users/${adminUser.id}`)
					.set('X-API-Key', token)
					.expect(204);
			}
		}

		// Ora prova a eliminare se stesso (ultimo admin)
		await request(app)
			.delete(`/api/v1/users/${id}`)
			.set('X-API-Key', token)
			.expect(409);
	}, 20000);
});

// User story 26: Admin Delete User
describe('User story 26: Admin Delete User', () => {
	test('100: Eliminazione di un utente esistente', async () => {
		const admin = testAdmins[0];
		const citizen = testCitizens[3];

		let res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: admin.username, password: admin.password })
			.expect(200);

		const token = res.body.token;

		res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: citizen.username, password: citizen.password })
			.expect(200);

		const id = res.body.user.id;

		await request(app)
			.delete(`/api/v1/users/${id}`)
			.set('X-API-Key', token)
			.expect(204);
	});

	test('101: Eliminazione di un utente esistente ma senza autenticazione', async () => {
		const citizen = testCitizens[4];

		let res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: citizen.username, password: citizen.password })
			.expect(200);

		const id = res.body.user.id;

		await request(app)
			.delete(`/api/v1/users/${id}`)
			.expect(401);
	});

	test('102: Eliminazione di un utente non esistente', async () => {
		const admin = testAdmins[0];

		let res = await request(app)
			.post('/api/v1/authentication')
			.send({ username: admin.username, password: admin.password })
			.expect(200);

		const token = res.body.token;

		await request(app)
			.delete(`/api/v1/users/${new mongoose.Types.ObjectId().toHexString()}`)
			.set('X-API-Key', token)
			.expect(404);
	});
});



// User story 14: Read Sent Reports
describe(' User story 14: Read Sent Reports', () => {

	beforeAll(async () => {
		for (const admin of testAdmins) {
			const res = await request(app)
				.post('/api/v1/users')
				.set('X-API-Key', tokenAdmin)
				.send({ ...admin, role: "admin" });

			createdAdmins.push(res.body);
		}
		for (const citizen of testCitizens) {
			const res = await request(app)
				.post('/api/v1/users')
				.set('X-API-Key', tokenAdmin)
				.send({ ...citizen, role: "citizen" });

			createdCitizens.push(res.body);
		}
	}, 20000);


	test('55: Lettura delle segnalazioni di un utente specifico fornendo l\'id ma senza offset e limit', async () => {

		const userId = createdAdmins[1].id;

		const res = await request(app)
			.get(`/api/v1/users/${userId}/reports`)
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('56: Lettura delle segnalazioni di un utente specifico fornendo id e offset ma senza limit', async () => {
		const userId = createdAdmins[1].id

		const res = await request(app)
			.get(`/api/v1/users/${userId}/reports`)
			.query({ offset: 1 })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('57: Lettura delle segnalazioni di un utente specifico fornendo id e limit ma senza offset', async () => {

		const userId = createdAdmins[1].id
		const limit = 5;

		const res = await request(app)
			.get(`/api/v1/users/${userId}/reports`)
			.query({ limit: 5 })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeLessThanOrEqual(limit);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('58: Lettura delle segnalazioni di un utente specifico fornendo id limit e offset', async () => {

		const userId = createdAdmins[1].id
		const limit = 5;

		const res = await request(app)
			.get(`/api/v1/users/${userId}/reports`)
			.query({ limit: 5, offset: 1 })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeLessThanOrEqual(limit);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('59: Lettura delle segnalazioni di un utente non esistente fornendo id limit e offset', async () => {
		const nonExistentId = new mongoose.Types.ObjectId();
		await request(app)
			.get(`/api/v1/users/${nonExistentId}/reports`)
			.query({ limit: 5, offset: 1 })
			.expect(404);
	});
});



// User story 23: Read Users
describe('User story 23: Read Users', () => {

	test('84: Lettura degli utenti senza offset e limit', async () => {
		const res = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
	});

	test('85: Lettura degli utenti senza offset e limit ma senza autenticazione', async () => {
		const res = await request(app)
			.get('/api/v1/users')
			.expect(401);
	});

	test('86: Lettura degli utenti senza offset e limit ma con autenticazione cittadino', async () => {
		const res = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', tokenCitizen)
			.expect(403);
	});

	test('87: Lettura degli utenti con offset e limit', async () => {
		const offset = 2
		const limit = 4

		const res = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.query({ offset, limit })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeLessThanOrEqual(limit);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('88: Lettura degli utenti con solo offset', async () => {
		const offset = 2

		const res = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.query({ offset })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});

	test('89: Lettura degli utenti con solo limit', async () => {
		const limit = 4

		const res = await request(app)
			.get('/api/v1/users')
			.set('X-API-Key', tokenAdmin)
			.query({ limit })
			.expect(200);

		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeLessThanOrEqual(limit);
		expect(res.body.length).toBeGreaterThanOrEqual(0);
	});
});
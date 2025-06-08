const request = require('supertest');
const db = require('../src/database/DatabaseClient');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { createTestSites, createTestReports } = require('../src/utils/createTest');

const tokenAdmin = jwt.sign(
	{ id: new mongoose.Types.ObjectId().toHexString(), role: 'admin' },
	process.env.JWT_SECRET || 'your_jwt_secret',
	{ expiresIn: '1h' }
);

const tokenCitizen = jwt.sign(
	{ id: new mongoose.Types.ObjectId().toHexString(), role: 'citizen' },
	process.env.JWT_SECRET || 'your_jwt_secret',
	{ expiresIn: '1h' }
);

beforeAll(async () => {
	await db.connect(process.env.DB_TEST);

	const siteRes = await request(app)
		.post('/api/v1/sites')
		.set('X-API-Key', tokenAdmin)
		.send(createTestSites(1)[0])
		.expect(201);
	testSite = siteRes.body;

	const reportRes = await request(app)
		.post('/api/v1/reports')
		.set('X-API-Key', tokenAdmin)
		.send(createTestReports(1)[0])
		.expect(201);
	testReport = reportRes.body;
});

afterAll(async () => {
	await db.disconnect();
});

// User story 22: Notify Users
describe('User story 22: Notify Users', () => {
	test('106: Creazione di una notifica senza riferimenti', async () => {
		const notificationData = {
			message: 'Notifica 1',
		};

		const res = await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(201);

		expect(res.body).toHaveProperty('id');
		expect(res.body.message).toBe(notificationData.message);
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.reportId).toBeUndefined();
		expect(res.body.siteId).toBeUndefined();
	});

	test('107: Creazione di una notifica con riferimento a un cantiere esistente', async () => {
		const createSiteRes = await request(app)
			.post('/api/v1/sites')
			.set('X-API-Key', tokenAdmin)
			.send(createTestSites(1)[0])
			.expect(201);
		const firstSiteId = createSiteRes.body.id;

		expect(firstSiteId).toBeDefined();

		const notificationData = {
			message: 'Notifica 2',
			siteId: firstSiteId,
		};

		const res = await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(201);

		expect(res.body).toHaveProperty('id');
		expect(res.body.message).toBe(notificationData.message);
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.reportId).toBeUndefined();
		expect(res.body.siteId).toBe(notificationData.siteId);
	});

	test('108: Creazione di una notifica con riferimento a una segnalazione esistente', async () => {
		const createReportRes = await request(app)
			.post('/api/v1/reports')
			.set('X-API-Key', tokenAdmin)
			.send(createTestReports(1)[0])
			.expect(201);
		const firstReportId = createReportRes.body.id;

		expect(firstReportId).toBeDefined();

		const notificationData = {
			message: 'Notifica 3',
			reportId: firstReportId,
		};

		const res = await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(201);

		expect(res.body).toHaveProperty('id');
		expect(res.body.message).toBe(notificationData.message);
		expect(res.body.createdAt).toBeDefined();
		expect(res.body.reportId).toBe(notificationData.reportId);
		expect(res.body.siteId).toBeUndefined();
	});

	test('109: Creazione di una notifica ma senza autenticazione', async () => {
		const notificationData = {
			message: 'Notifica 4',
		};

		await request(app)
			.post('/api/v1/notifications')
			.send(notificationData)
			.expect(401);
	});

	test('110: Creazione di una notifica ma con autenticazione cittadino', async () => {
		const notificationData = {
			message: 'Notifica 5',
		};

		await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenCitizen)
			.send(notificationData)
			.expect(403);
	});

	test('111: Creazione di una notifica senza messaggio', async () => {
		const notificationData = {};

		await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(400);
	});

	test('112: Creazione di una notifica con riferimento a un cantiere non esistente', async () => {
		const notificationData = {
			message: 'Notifica 6',
			siteId: new mongoose.Types.ObjectId().toHexString(),
		};

		await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(404);
	});

	test('113: Creazione di una notifica con riferimento a una segnalazione non esistente', async () => {
		const notificationData = {
			message: 'Notifica 7',
			reportId: new mongoose.Types.ObjectId().toHexString(),
		};

		const res = await request(app)
			.post('/api/v1/notifications')
			.set('X-API-Key', tokenAdmin)
			.send(notificationData)
			.expect(404);
	});
});
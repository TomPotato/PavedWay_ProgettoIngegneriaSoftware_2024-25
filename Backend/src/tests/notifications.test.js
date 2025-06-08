const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { Notification } = require('../models/Notification');

const tokenAdmin = jwt.sign(
	{ id: new mongoose.Types.ObjectId().toHexString(), role: 'admin' },
	process.env.JWT_SECRET || 'your_jwt_secret',
	{ expiresIn: '1h' }
);

beforeAll(async () => {
	const uri = process.env.DB_URI;
	await mongoose.connect(uri, {
		dbName: process.env.DB_TEST,
	});

	await Notification.deleteMany({});
});

afterAll(async () => {
	await mongoose.connection.close();
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

	test('107: Crazione di una notifica con riferimento a un cantiere esistente', async () => {
		const notificationData = {
			message: 'Notifica 2',
			siteId: new mongoose.Types.ObjectId().toHexString(), // Assicurati che questo ID esista nel tuo database
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
});
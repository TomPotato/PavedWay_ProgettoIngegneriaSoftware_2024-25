const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
	const uri = process.env.DB_URI;
	await mongoose.connect(uri, {
		dbName: process.env.DB_TEST,
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

// Test per API: GET /api/v1/paths
describe('GET /api/v1/paths', () => {
	// User story: Find Direct Path
	test('104: Ricerca di un percorso diretto con coordinate di partenza e arrivo valide', async () => {
		const res = await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: 11.150538607628965,
				endLatitude: 46.07168990174234,
				endLongitude: 11.121326475452388,
			}).expect(200);
	});

	test('105: Ricerca di un percorso diretto con coordinate mancanti', async () => {
		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLongitude: 11.150538607628965,
				endLatitude: 46.07168990174234,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				endLatitude: 46.07168990174234,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: 11.150538607628965,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: 11.150538607628965,
				endLatitude: 46.07168990174234,
			})
			.expect(400);
	});

	test('106: Ricerca di un percorso diretto con coordinate non valide', async () => {
		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 97.34,
				startLongitude: 11.150538607628965,
				endLatitude: 46.07168990174234,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: -192.28,
				endLatitude: 46.07168990174234,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: 11.150538607628965,
				endLatitude: -97.51,
				endLongitude: 11.121326475452388,
			})
			.expect(400);

		await request(app)
			.get('/api/v1/paths')
			.query({
				model: 'direct',
				startLatitude: 46.06785279186342,
				startLongitude: 11.150538607628965,
				endLatitude: 46.07168990174234,
				endLongitude: 192.87,
			})
			.expect(400);
	});
});
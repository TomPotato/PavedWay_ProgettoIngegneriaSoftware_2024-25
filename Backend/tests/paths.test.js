const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/DatabaseClient');

beforeAll(async () => {
	await db.connect(process.env.DB_TEST);
});

afterAll(async () => {
	await db.disconnect();
});

// User story 27: Find Direct Path
describe('User story 27: Find Direct Path', () => {
	// User story: Find Direct Path
	test('103: Ricerca di un percorso diretto con coordinate di partenza e arrivo valide', async () => {
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

	test('104: Ricerca di un percorso diretto con coordinate mancanti', async () => {
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

	test('105: Ricerca di un percorso diretto con coordinate non valide', async () => {
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
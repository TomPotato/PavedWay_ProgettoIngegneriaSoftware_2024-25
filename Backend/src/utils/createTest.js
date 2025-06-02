const mongoose = require('mongoose');
const { Report } = require('../models/Report');
const { Site } = require('../models/Site'); 
const { User } = require('../models/User');
const { Citizen } = require('../models/Citizen');
const bcrypt = require('bcrypt');

/**
 * Crea dei report di test completi nel database.
 * @param {number} count - Numero di report da creare.
 * @returns {Promise<void>}
 */
async function createTestReports(count = 10) {
  await Report.deleteMany({});

  const testReports = Array.from({ length: count }).map((_, i) => {
    const userId = new mongoose.Types.ObjectId();
    const createdBy = new mongoose.Types.ObjectId();

    return {
      name: `Segnalazione ${i + 1}`,
      info: `Descrizione dell'evento numero ${i + 1}`,
      location: {
        latitude: 45.0 + i * 0.01,
        longitude: 9.0 + i * 0.01,
        street: `Via Test ${i + 1}`,
        number: `${i + 1}`,
        city: `Città ${i + 1}`,
        code: 10000 + i,
      },
      duration: {
        start: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
        end: new Date(Date.now() + (i + 1) * 1000 * 60 * 60).toISOString(),
      },
      createdAt: new Date(Date.now() + i * 1000),
      comments: [
        {
          userId: 1000 + i,
          text: `Commento di test ${i + 1}`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdBy: createdBy,
      photos: [
        `http://example.com/photo${i + 1}-1.jpg`,
        `http://example.com/photo${i + 1}-2.jpg`,
      ],
      rating: 0,
      status: ['pending', 'approved', 'rejected'][i % 3],
    };
  });

  const insertedReports = await Report.insertMany(testReports);
  return insertedReports;
}

/**
 * Crea dei cantieri (sites) di test completi nel database.
 * @param {number} count - Numero di site da creare.
 * @returns {Promise<void>}
 */
async function createTestSites(count = 10) {
  await Site.deleteMany({});

  const testSites = Array.from({ length: count }).map((_, i) => {
    return {
      name: `Cantiere ${i + 1}`,
      info: `Descrizione del cantiere numero ${i + 1}`,
      location: {
        latitude: 45.0 + i * 0.01,
        longitude: 9.0 + i * 0.01,
        street: `Via Cantiere ${i + 1}`,
        number: `${i + 1}`,
        city: `Città Cantiere ${i + 1}`,
        code: 20000 + i,
      },
      duration: {
        start: new Date(Date.now() - i * 3600000).toISOString(),
        end: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
      },
      realDuration: {
        start: new Date(Date.now() - i * 3600000).toISOString(),
        end: new Date(Date.now() + (i + 2) * 3600000).toISOString(),
      },
      createdAt: new Date(Date.now() + i * 1000),
      comments: [
        {
          userId: 2000 + i,
          text: `Commento sul cantiere ${i + 1}`,
          createdAt: new Date().toISOString(),
        },
      ],
      companyName: `Impresa ${i + 1}`,
    };
  });

  await Site.insertMany(testSites);
}

/**
 * Crea degli user di test senza salvarli nel database.
 * @param {number} count - Numero di utenti da creare.
 * @return {Promise<Array>} - Array di oggetti utente di test.
 */
async function createTestUsers(count = 1) {
  const users = [];

  for (let i = 0; i < count; i++) {

    const user = {
      username: `user${i + 1}`,
      name: `Nome`,
      surname: `Cognome`,
      password: `Password${i + 1}_`,
      email: `user${i + 1}@example.com`
    };

    users.push(user);
  }

  return users;
}



module.exports = {
  createTestReports,
  createTestSites,
  createTestUsers
};

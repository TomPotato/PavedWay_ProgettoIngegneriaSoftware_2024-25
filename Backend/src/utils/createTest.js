const { faker } = require('@faker-js/faker');
const { Report } = require('../models/Report');
const { User } = require('../models/User');

async function createTestUser() {
  const user = new User({
    username: faker.internet.userName(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    password: faker.internet.password(),
  });
  await user.save();
  return user;
}

async function createTestReport(userId) {
  const start = faker.date.past();
  const end = faker.date.future({ refDate: start });

  const report = new Report({
    name: faker.lorem.words(3),
    info: faker.lorem.paragraph(),
    location: {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      city: faker.location.city(),
      code: faker.location.zipCode('#####'),
    },
    duration: { start, end },
    createdBy: userId,
    photos: [faker.image.url()],
    rating: faker.number.int({ min: 1, max: 5 }),
    status: 'approved',
    comments: [
      {
        text: faker.lorem.sentence(),
        createdAt: new Date(),
        createdBy: userId,
      },
    ],
  });

  await report.save();
  return report;
}

module.exports = { createTestUser, createTestReport };

const db = require('../src/database/DatabaseClient');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async function (globalConfig, projectConfig) {
    await db.connect(process.env.DB_TEST);

    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }

    await db.disconnect();
};

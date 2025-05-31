const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseClient {
    constructor() {
        this._status = false;
    }

    async connect() {
        if (this._status) {
            return this._connection;
        }

        const uri = process.env.DB_URI;
        if (!uri) {
            throw new Error('La variabile d\'ambiente DB_URI non è definita');
        }

        try {
            await mongoose.connect(process.env.DB_URI, {
                dbName: process.env.DB_TEST,
            });
            this._status = true;
        } catch (error) {
            console.error('[MongoDB] Errore durante la connessione: ', error);
            throw error;
        }

        mongoose.connection.on('connected', () => { console.log('[MongoDB] Connesso'); });
        mongoose.connection.on('error', (err) => { console.error('[MongoDB] Errore durante la connessione: ', err); });
        mongoose.connection.on('disconnected', () => { console.log('[MongoDB] Disconnesso'); });
    }

    get status() {
        return this._status;
    }

    async disconnect() {
        await mongoose.connection.close();
    }
}

module.exports = new DatabaseClient();

const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.DB_URL);

class Database {
    connect() {
        mongoose.connect(process.env.DB_URL);
    }
}

const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const db = require('./src/database/DatabaseClient');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

db.connect().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server in esecuzione su http://${HOST}:${PORT}/`);
    });
});



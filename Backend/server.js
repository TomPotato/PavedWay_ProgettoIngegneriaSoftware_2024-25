const app = require('./src/app');
const dotenv = require('dotenv');
const db = require('./src/database/DatabaseClient');

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

db.connect().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server in esecuzione su http://${HOST}:${PORT}/`);
    });
});



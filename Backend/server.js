const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const db = require('./src/database/DatabaseClient');

const PORT = process.env.PORT || 3000;

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`[Paved Way] Server in esecuzione sulla porta ${PORT}`);
    });
});



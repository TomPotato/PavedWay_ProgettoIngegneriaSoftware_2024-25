const jwt = require('jsonwebtoken');
const createError = require('./createError');

/**
 * Middleware per decodificare il token JWT
 * 
 * @param {object} req - Oggetto richiesta.
 * @param {object} res - Oggetto risposta.
 * @param {function} next - Funzione per passare al middleware successivo.
 * @returns {void}
 */
function tokenDecoder(req, res, next) {
    const token = req.headers['x-api-key'];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json(createError('Token non valido', 403, 'Devi fornire un token valido.'));
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
}


/**
 * Middleware per il controllo del token di autorizzazione
 * 
 * @param {object} req - Oggetto richiesta.
 * @param {object} res - Oggetto risposta.
 * @param {function} next - Funzione per passare al middleware successivo.
 * @returns {void}
 */
function tokenChecker(req, res, next) {
    const token = req.headers['x-api-key'];

    if (!token) {
        res.status(401).json(createError('Non autorizzato', 401, 'Devi fornire un token di autorizzazione.'));
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json(createError('Non autorizzato', 401, 'Token non valido. Devi fornire un token di autorizzazione.'));
        } else {
            req.user = decoded;
            next();
        }
    });
}

module.exports = tokenChecker;
module.exports.tokenDecoder = tokenDecoder;
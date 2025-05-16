const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');

class AuthService {
    async authenticate(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw createError('Autenticazione fallita', 401, 'Nome utente o password non validi.');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw createError('Autenticazione fallita', 401, 'Nome utente o password non validi.');
            }

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            return token;
        } catch (error) {
            const message = 'Errore interno del server durante l\'autenticazione.';
            throw createError('Errore interno del server', 500, message);
        }
    }
}

module.exports = new AuthService();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { Citizen } = require('../models/Citizen');

const createError = require('../utils/createError');

class AuthService {
    async register(username, name, surname, email, password) {
        try {
            const existingUsername = await User.find({ username });
            if (existingUsername.length > 0) {
                throw createError('Registrazione fallita', 409, 'Nome utente già in uso.');
            }

            const existingEmail = await Citizen.find({ email });
            if (existingEmail.length > 0) {
                throw createError('Registrazione fallita', 409, 'Email già in uso.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newCitizen = new Citizen({
                username: username,
                name: name,
                surname: surname,
                email: email,
                password: hashedPassword,
            });
            await newCitizen.save();

            const token = jwt.sign({ id: newCitizen._id, role: newCitizen.__t }, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            return token;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la registrazione.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    async login(username, password) {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                throw createError('Autenticazione fallita', 401, 'Nome utente o password non validi.');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw createError('Autenticazione fallita', 401, 'Nome utente o password non validi.');
            }

            const token = jwt.sign({ id: user._id, role: user.__t }, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            return token;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante l\'autenticazione.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }
}

module.exports = new AuthService();
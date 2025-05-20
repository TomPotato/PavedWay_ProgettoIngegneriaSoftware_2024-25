const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/User');
const { Citizen } = require('../models/Citizen');

const createError = require('../utils/createError');

class AuthService {
    /**
     * Registra un nuovo utente cittadino (Citizen) con le credenziali fornite.
     *
     * @async
     * @param {Object} citizenData - I dati del cittadino da registrare.
     * @param {string} citizenData.username - Il nome utente desiderato per il nuovo cittadino.
     * @param {string} citizenData.name - Il nome del cittadino.
     * @param {string} citizenData.surname - Il cognome del cittadino.
     * @param {string} citizenData.email - L'email del cittadino.
     * @param {string} citizenData.password - La password del cittadino.
     * @returns {Promise<{ token: string, user: { username: string, name: string, surname: string, role: string } }>} Un oggetto contenente il token JWT e i dati del cittadino.
     * @throws {Error} Solleva un errore se la registrazione fallisce o se si verifica un errore interno del server.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Controlla se il nome utente è già in uso. Se sì, solleva un errore 409 (Conflict).
     * 2. Controlla se l'email è già in uso. Se sì, solleva un errore 409 (Conflict).
     * 3. Crea un nuovo utente cittadino (Citizen) con le credenziali fornite.
     * 4. Hash della password utilizzando bcrypt.
     * 5. Salva il nuovo utente nel database.
     * 6. Genera un token JWT per l'utente appena registrato.
     * 7. Restituisce il token e i dati dell'utente.
     */
    async register(citizenData) {
        try {
            const { username, name, surname, email, password } = citizenData;

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

            return {
                token,
                user: {
                    username: newCitizen.username,
                    name: newCitizen.name,
                    surname: newCitizen.surname,
                    role: newCitizen.__t,
                },
            };
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la registrazione.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    /**
     * Autentica un utente con il nome utente e la password forniti.
     * Se l'autenticazione ha successo, restituisce un token JWT e i dati dell'utente.
     * Solleva un errore se l'autenticazione fallisce o se si verifica un errore interno del server.
     *
     * @async
     * @param {string} username - Il nome utente dell'utente che tenta di accedere.
     * @param {string} password - La password in chiaro dell'utente.
     * @returns {Promise<{ token: string, user: { username: string, name: string, surname: string, role: string } }>} Un oggetto contenente il token JWT e i dati dell'utente.
     * @throws {Error} Solleva un errore se l'autenticazione fallisce o se si verifica un errore interno del server.
     *
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Cerca un utente con il nome utente fornito. Se non esiste, solleva un errore 401 (Unauthorized).
     * 2. Confronta la password fornita con quella salvata (hash) usando bcrypt. Se non corrisponde, solleva un errore 401.
     * 3. Genera un token JWT per l'utente autenticato.
     * 4. Restituisce il token e i dati dell'utente.
     */
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

            const userInfo = {
                username: user.username,
                name: user.name,
                surname: user.surname,
                role: user.__t,
            }

            if (user.__t === 'admin') {
                userInfo.office = user.office;
            } else {
                userInfo.email = user.email;
            }

            return {
                token,
                user: userInfo,
            };
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
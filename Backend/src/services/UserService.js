const bcrypt = require('bcrypt');

const { User } = require('../models/User');
const { Admin } = require('../models/Admin');
const { Citizen } = require('../models/Citizen');

const createError = require('../utils/createError');

class UserService {
    /**
     * Crea un nuovo utente nel database con le credenziali fornite.
     * 
     * @async
     * @param {Object} userData - I dati dell'utente da creare.
     * @param {string} userData.username - Il nome utente desiderato per il nuovo utente.
     * @param {string} userData.name - Il nome dell'utente.
     * @param {string} userData.surname - Il cognome dell'utente.
     * @param {string} userData.password - La password dell'utente.
     * @param {string} userData.role - Il ruolo dell'utente (admin o citizen).
     * @param {string} [userData.email] - L'email dell'utente (richiesta solo per il ruolo citizen).
     * @param {string} [userData.office] - L'ufficio dell'utente (richiesto solo per il ruolo admin).
     * @returns {Promise<User>} L'utente creato.
     * @throws {Error} Se si verifica un errore durante la creazione dell'utente, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Controlla se il nome utente è già in uso. Se sì, solleva un errore 409 (Conflict).
     * 2. Se il ruolo è citizen, controlla se l'email è già in uso. Se sì, solleva un errore 409 (Conflict).
     * 3. Hash della password utilizzando bcrypt.
     * 4. Crea un nuovo oggetto utente (Admin o Citizen) con i dati forniti.
     * 5. Salva il nuovo utente nel database.
     * 6. Se si verifica un errore durante il salvataggio, solleva un errore 500 (Internal Server Error).
     * 7. Restituisce l'utente creato.
     */
    async createUser(userData) {
        const { username, name, surname, password, role, email, office } = userData;

        try {
            const existingUser = await User.find({ username });
            if (existingUser.length > 0) {
                throw createError('Registrazione fallita', 409, 'Nome utente già in uso.');
            }

            if (role === 'citizen') {
                const existingEmail = await Citizen.find({ email });
                if (existingEmail.length > 0) {
                    throw createError('Registrazione fallita', 409, 'Email già in uso.');
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            if (userData.role === 'admin') {
                const admin = new Admin({
                    username: username,
                    name: name,
                    surname: surname,
                    password: hashedPassword,
                    office: office,
                });
                await admin.save();
                return admin;
            } else {
                const citizen = new Citizen({
                    username: username,
                    name: name,
                    surname: surname,
                    password: hashedPassword,
                    email: email,
                });
                await citizen.save();
                return citizen;
            }
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la creazione dell\'utente.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    /**
     * Recupera gli utenti dal database.
     * 
     * @async
     * @param {number} offset - Il numero di utenti da saltare.
     * @param {number} limit - Il numero massimo di utenti da recuperare.
     * @returns {Promise<Array<User>>} Un array di utenti.
     * @throws {Error} Se si verifica un errore durante la ricerca degli utenti, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Crea una query per recuperare tutti gli utenti.
     * 2. Se è fornito un offset e un limite, applica questi parametri alla query.
     * 3. Esegue la query e restituisce gli utenti recuperati.
     * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
     */
    async getUsers(offset, limit) {
        try {
            let query = User.find({});

            if (offset && offset > 0) {
                query = query.skip(offset);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const users = await query.exec();
            return users;
        } catch (error) {
            const message = 'Errore interno del server durante la lettura degli utenti.';
            throw createError('Errore interno del server', 500, message);
        }
    }

    /**
     * Recupera un utente dal database in base all'ID fornito.
     * 
     * @async
     * @param {string} id - L'ID dell'utente da recuperare.
     * @returns {Promise<User>} L'utente recuperato.
     * @throws {Error} Se si verifica un errore durante la ricerca dell'utente, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Controlla se l'utente esiste nel database in base all'ID fornito.
     * 2. Se l'utente non esiste, solleva un errore 404 (Not Found).
     * 3. Se l'utente esiste, recupera l'utente dal database.
     * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
     */
    async getUserById(id) {
        try {
            const user = await User.exists({ _id: id });
            if (!user) {
                throw createError('Utente non trovato.', 404, 'Nessun utente trovato con questo ID.');
            }
            return await User.findById(id);
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la ricerca tramite ID.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }
}

module.exports = new UserService();
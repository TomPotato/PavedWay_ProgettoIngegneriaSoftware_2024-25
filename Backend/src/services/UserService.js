const { User } = require('../models/User');

const createError = require('../utils/createError');

class UserService {
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
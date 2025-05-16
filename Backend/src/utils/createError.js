/**
 * Crea un oggetto errore strutturato.
 * @param {string} error - Nome dell'errore.
 * @param {number} code - Codice numerico dell'errore.
 * @param {string} message - Messaggio di errore dettagliato.
 * @returns {object} Oggetto errore standardizzato.
 */
function createError(error, code, message) {
  return {
    error,
    code,
    message,
  };
}

module.exports = createError;

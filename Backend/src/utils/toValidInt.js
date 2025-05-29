/**
 * Converte una stringa in numero intero e lo ritorna se valido.
 * @param {object} value - Oggetto da convertire.
 * @returns {number|null} Numero convertito o null se non valido.
 */
function toValidInt(value) {
  const parsedValue = parseInt(value, 10);
  return isNaN(parsedValue) ? null : parsedValue;
}

module.exports = toValidInt;
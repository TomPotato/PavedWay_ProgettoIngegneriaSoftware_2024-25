/**
 * Converte una stringa in numero con la virgola e lo ritorna se valido.
 * @param {object} value - Oggetto da convertire.
 * @returns {number|null} Numero convertito o null se non valido.
 */
function toValidFloat(value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? null : parsedValue;
}

module.exports = toValidFloat;
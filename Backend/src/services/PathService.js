const ors = require('openrouteservice-js');
const createError = require('../utils/createError');

class PathService {
    constructor() {
        this.token = process.env.ORS_API_KEY;
        if (!this.token) {
            throw new Error('La variabile d\'ambiente ORS_API_KEY non è definita');
        }

        this.directions = new ors.Directions({ api_key: this.token });
    }

    /**
     * Calcola un percorso tra due coordinate geografiche utilizzando il servizio OpenRouteService.
     * @param {number} sLat - Latitudine del punto di partenza.
     * @param {number} sLon - Longitudine del punto di partenza.
     * @param {number} eLat - Latitudine del punto di arrivo.
     * @param {number} eLon - Longitudine del punto di arrivo.
     * @return {Promise<Object>} Un oggetto GeoJSON che rappresenta il percorso calcolato.
     * @throws {Error} Se si verifica un errore durante la ricerca del percorso, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Utilizza il servizio OpenRouteService per calcolare un percorso tra le coordinate di partenza e arrivo fornite.
     * 2. Specifica il profilo di viaggio come 'driving-car' e il formato della risposta come 'geojson'.
     * 3. Se la richiesta ha successo, restituisce un oggetto GeoJSON che rappresenta il percorso.
     * 4. Se si verifica un errore, solleva un'eccezione con un messaggio di errore e un codice di stato appropriati.
     */
    async getPath(sLat, sLon, eLat, eLon) {
        try {
            const response = await this.directions.calculate({
                coordinates: [[sLon, sLat], [eLon, eLat]],
                profile: 'driving-car',
                format: 'geojson',
                language: 'it',
            });
            return response;
        } catch (error) {
            throw createError(
                'Errore durante la ricerca del percorso',
                error.status || 500,
                error.message || 'Si è verificato un errore durante la ricerca del percorso.'
            );
        }
    }
}

module.exports = new PathService();


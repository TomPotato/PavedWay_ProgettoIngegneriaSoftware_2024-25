const ors = require('openrouteservice-js');

class PathService {
    constructor() {
        this.token = process.env.ORS_API_KEY;
        if (!this.token) {
            throw new Error('La variabile d\'ambiente ORS_API_KEY non è definita');
        }

        this.directions = new ors.Directions({ api_key: this.token });
    }

    async getPath(sLat, sLon, eLat, eLon) {
        // TODO: select profile
        const response = await this.directions.calculate({
            coordinates: [[sLon, sLat], [eLon, eLat]],
            profile: 'driving-car',
            format: 'geojson',
            instructions: false,
        });
    }
}

module.exports = new PathService();


const { Site } = require('../models/Site');

class SiteService {
    async getSites(offset, limit) {
        try {
            let query = Site.find({});

            if (offset) {
                query = query.skip(offset);
            }

            if (limit) {
                query = query.limit(limit);
            }

            const sites = await query.exec();
            return sites;
        } catch (error) {
            console.error('Errore durante la lettura:', error);
            throw new Error(error);
        }
    }

    async createSite(siteData) {
        try {
            const site = new Site(siteData);
            await site.save();
            return site;
        } catch (error) {
            console.error('Errore durante la creazione:', error);
            throw new Error(error);
        }
    }

    async updateSite(siteData, siteId){
        try {
            const site = new Site(siteData);
            Site.find(siteId) = site;
            await Site.find(siteId).save();
            return site;
        } catch (error){
            console.error('Errore durante la modifica:', error);
            throw new Error(error);
        }
    }
}

module.exports = new SiteService();
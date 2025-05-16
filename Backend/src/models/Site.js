const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Event } = require('./Event');
const { Duration } = require('./Duration');

const siteSchema = new Schema({
    companyName: {
        type: String,
        required: true,
    },
    realDuration: {
        type: Duration,
    },
});

siteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

// Site eredita la struttura di Event, aggiungendo nuovi campi
const Site = Event.discriminator('Site', siteSchema);

module.exports = {
    siteSchema,
    Site,
};
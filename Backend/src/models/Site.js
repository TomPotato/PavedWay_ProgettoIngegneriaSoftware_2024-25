const mongoose = require('mongoose');
const { Schema } = mongoose;

const { Event } = require('./Event');

const reportSchema = new Schema({
    createdBy: {
        type: Number,
        required: true,
    },
    photos: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
});

// Report eredita la struttura di Event, aggiungendo nuovi campi
const Report = Event.discriminator('Report', reportSchema);

module.exports = {
    reportSchema,
    Report,
};
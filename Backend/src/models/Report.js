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

reportSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

// Report eredita la struttura di Event, aggiungendo nuovi campi
const Report = Event.discriminator('Report', reportSchema);

module.exports = {
    reportSchema,
    Report,
};



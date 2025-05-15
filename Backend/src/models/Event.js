const mongoose = require('mongoose');
const { Schema } = mongoose;

const { locationSchema } = require('./Location');
const { durationSchema } = require('./Duration');
const { commentSchema } = require('./Comment');

const eventSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['report', 'site'],
        default: 'report',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: locationSchema,
    duration: durationSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    eventSchema,
    Event,
};
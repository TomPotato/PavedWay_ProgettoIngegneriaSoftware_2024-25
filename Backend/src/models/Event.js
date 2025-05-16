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
    eventType: {
        type: String,
        enum: ['report', 'site'],
        required: true,
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
    location: {
        type: locationSchema,
        required: true,
    },
    duration: {
        type: durationSchema,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    comments: [commentSchema],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    eventSchema,
    Event,
};
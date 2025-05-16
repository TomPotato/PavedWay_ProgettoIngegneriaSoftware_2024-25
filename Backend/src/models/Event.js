const mongoose = require('mongoose');
const { Schema } = mongoose;

const { locationSchema } = require('./Location');
const { durationSchema } = require('./Duration');
const { commentSchema } = require('./Comment');

const eventSchema = new Schema({
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
    info: {
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
        default: Date.now,
    },
    comments: [commentSchema],
});

eventSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    eventSchema,
    Event,
};
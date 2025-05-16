const mongoose = require('mongoose');
const { Schema } = mongoose;

const { locationSchema } = require('./Location');
const { durationSchema } = require('./Duration');
const { commentSchema } = require('./Comment');

const siteSchema = new Schema({
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
    companyName: {
        type: String,
        required: true,
    },
    location: {
        type: locationSchema,
        required: true,
    },
    duration: {
        type: durationSchema,
        required: true,
    },
    realDuration: durationSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema],
});

siteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Site = mongoose.model('Site', siteSchema);

module.exports = {
    siteSchema,
    Site,
};
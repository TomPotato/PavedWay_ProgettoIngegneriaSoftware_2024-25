const mongoose = require('mongoose');
const { Schema } = mongoose;

const { locationSchema } = require('./Location');
const { durationSchema } = require('./Duration');
const { commentSchema } = require('./Comment');

const reportSchema = new Schema({
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
    createdBy: {
        type: Schema.Types.ObjectId,
    },
    photos: {
        type: [String],
    },
    rating: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    commenst: [commentSchema],
});

reportSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = {
    reportSchema,
    Report,
};



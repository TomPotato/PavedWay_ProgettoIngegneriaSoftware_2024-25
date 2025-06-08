const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reportId: {
        type: String,
    },
    siteId: {
        type: String,
    },
});

notificationSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
    notificationSchema,
    Notification,
};
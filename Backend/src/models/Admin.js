const mongoose = require('mongoose');
const { Schema } = mongoose;

const { userSchema } = require('./User');

const adminSchema = new Schema({
    office: {
        type: String,
        required: true,
        trim: true,
    },
});

adminSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        ret.role = ret.__t;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Citizen = userSchema.discriminator('admin', citizenSchema);

module.exports = {
    citizenSchema,
    Citizen,
};
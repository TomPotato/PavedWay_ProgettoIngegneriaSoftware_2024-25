const mongoose = require('mongoose');
const { Schema } = mongoose;

const { userSchema } = require('./User');

const citizenSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
});

citizenSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        ret.role = ret.__t;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Citizen = userSchema.discriminator('citizen', citizenSchema);

module.exports = {
    citizenSchema,
    Citizen,
};
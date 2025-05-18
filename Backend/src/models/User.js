const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        ret.role = ret.__t;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        delete ret.__t;
        return ret;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = {
    userSchema,
    User,
};
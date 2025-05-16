const mongoose = require('mongoose');
const { format } = require('util');
const { Schema } = mongoose;

const locationSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
        format: {
            validator: function (v) {
                return v >= -90 && v <= 90;
            },
            message: (props) => `La latitudine deve essere compresa tra -90 e 90. Ricevuto: ${props.value}`,
        },
    },
    longitude: {
        type: Number,
        required: true,
        format: {
            validator: function (v) {
                return v >= -180 && v <= 180;
            },
            message: (props) => `La longitudine deve essere compresa tra -180 e 180. Ricevuto: ${props.value}`,
        },
    },
    street: {
        type: String,
        required: true,
        trim: true,
    },
    number: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{5}$/.test(v);
            },
            message: (props) => `Il CAP deve essere un numero di 5 cifre. Ricevuto: ${props.value}`,
        },
    },
});

locationSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {
    locationSchema,
    Location,
};
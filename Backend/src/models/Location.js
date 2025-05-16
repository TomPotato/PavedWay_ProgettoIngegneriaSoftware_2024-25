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
            message: (props) => format("Latitudine deve essere compresa tra -90 e 90. Inserito: %s", props.value),
        },
    },
    longitude: {
        type: Number,
        required: true,
        format: {
            validator: function (v) {
                return v >= -180 && v <= 180;
            },
            message: (props) => format("Longitudine deve essere compresa tra -180 e 180. Inserito: %s", props.value),
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
            message: (props) => format("Codice Postale deve essere massimo 5 numeri. Inserito: %s", props.value),
        },
    },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {
    locationSchema,
    Location,
};
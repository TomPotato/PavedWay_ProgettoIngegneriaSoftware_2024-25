const mongoose = require('mongoose');
const { Schema } = mongoose;

const durationSchema = new Schema({
    start: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v);
            },
            message: (props) => `Data di Inzio deve essere valida. Inserito: ${props.value}`,
        },
    },
    end: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v);
            },
            message: (props) => `Data di Fine deve essere valida. Inserito: ${props.value}`,
        },
        validate: {
            validator: function (v) {
                return v > this.start;
            },
            message: (props) => `la data di Fine deve essere anteriore a quella di Inizio. Inserito: ${props.value}`,
        },
    },
});

const Duration = mongoose.model('Duration', durationSchema);

module.exports = {
    durationSchema,
    Duration,
};

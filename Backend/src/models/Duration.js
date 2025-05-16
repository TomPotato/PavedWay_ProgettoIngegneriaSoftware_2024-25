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
            message: (props) => `La data di inizio deve essere una data valida. Ricevuto: ${props.value}`,
        },
    },
    end: {
        type: Date,
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v);
            },
            message: (props) => `La data di fine deve essere una data valida. Ricevuto: ${props.value}`,
        },
        validate: {
            validator: function (v) {
                return v > this.start;
            },
            message: (props) => `La data di fine deve essere successiva alla date di inizio. Ricevuto: ${props.value}`,
        },
    },
});

durationSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Duration = mongoose.model('Duration', durationSchema);

module.exports = {
    durationSchema,
    Duration,
};

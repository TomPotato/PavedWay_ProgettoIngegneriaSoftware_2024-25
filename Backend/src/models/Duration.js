import mongoose from "mongoose";
const { Schema } = mongoose;

const durationSchema = new Schema({
    start: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v);
            },
            message: (props) => `Start date must be a valid date. Received: ${props.value}`,
        },
    },
    end: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v instanceof Date && !isNaN(v);
            },
            message: (props) => `End date must be a valid date. Received: ${props.value}`,
        },
        validate: {
            validator: function (v) {
                return v > this.start;
            },
            message: (props) => `End date must be after start date. Received: ${props.value}`,
        },
    },
});

const Duration = mongoose.model('Duration', durationSchema);

export default Duration;
export { durationSchema };

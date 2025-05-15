import mongoose from "mongoose";
import { format } from "util";
const { Schema } = mongoose;

const locationSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
        format: {
            validator: function (v) {
                return v >= -90 && v <= 90;
            },
            message: (props) => format("Latitude must be between -90 and 90. Received: %s", props.value),
        },
    },
    longitude: {
        type: Number,
        required: true,
        format: {
            validator: function (v) {
                return v >= -180 && v <= 180;
            },
            message: (props) => format("Longitude must be between -180 and 180. Received: %s", props.value),
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
            message: (props) => format("Code must be a 5-digit number. Received: %s", props.value),
        },
    },
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
export { locationSchema };
import mongoose from "mongoose";
const { Schema } = mongoose;

import { locationSchema } from "./Location.js";
import { durationSchema } from "./Duration.js";
import { commentSchema } from "./Comment.js";

const eventSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    location: locationSchema,
    duration: durationSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema],
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
export { eventSchema };

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    commentSchema,
    Comment,
};
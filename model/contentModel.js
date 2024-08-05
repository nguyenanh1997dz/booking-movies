const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    img: {
        type: Object
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    hot: {
        type: Number,
        default: 0
    },
    blog: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }]
    },

})
module.exports = mongoose.model("Content", contentSchema);
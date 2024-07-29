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
    }

})
module.exports = mongoose.model("Content", contentSchema);
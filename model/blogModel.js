const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }],


})
module.exports = mongoose.model("Blog", blogSchema);
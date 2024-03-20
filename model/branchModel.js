const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema'
    },
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    }]


})
module.exports = mongoose.model("Branch", branchSchema);
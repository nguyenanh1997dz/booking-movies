const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    bookedSeats: {
        type: Object
    }


})
module.exports = mongoose.model("Interest", interestSchema);
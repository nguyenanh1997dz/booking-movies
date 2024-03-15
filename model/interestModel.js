const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    bookedSeats: {
        type: Object
    }


})
module.exports = mongoose.model("Interest", interestSchema);
const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    bookedSeats: {
        type: Object,
        default: []
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },

})
module.exports = mongoose.model("Interest", interestSchema);
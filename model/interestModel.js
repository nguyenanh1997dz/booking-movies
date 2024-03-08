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
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    seats: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seat'
        }],
        default: []
    }

})
module.exports = mongoose.model("Interest", interestSchema);
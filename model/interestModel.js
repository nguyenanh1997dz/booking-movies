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
    status:{
        type: String,
        default: "Sắp chiếu"
    }
})
module.exports = mongoose.model("Interest", interestSchema);

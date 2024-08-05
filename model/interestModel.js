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
        type: [String],
        default: []
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    status: {
        type: String,
        enum: ['Chưa bắt đầu', 'Đang diễn ra', 'Đã kết thúc'],
        default: 'Chưa bắt đầu'
    },
    price: {
        type:Number
    },
}
)
module.exports = mongoose.model("Interest", interestSchema);
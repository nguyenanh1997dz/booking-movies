 const mongoose = require('mongoose')
 
const roomSchema = new mongoose.Schema({
    name: String,
    seats: [],
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    // lịch chiếu
    schedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }]
});

module.exports = mongoose.model('Room', roomSchema);
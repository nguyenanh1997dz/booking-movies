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
    numberOfSeats: {
        type: Number,
        default: 60
    },
});

module.exports = mongoose.model('Room', roomSchema);
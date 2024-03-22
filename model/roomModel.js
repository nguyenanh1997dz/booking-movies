const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: String,
    interests: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    },
    bookedSeats: {
        type: Object
    }
});

module.exports = mongoose.model('Room', roomSchema);

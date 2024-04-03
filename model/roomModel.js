const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: String,
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    }],
    seats: Number,
    type: Array,
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    freeTimes: {
        type: Object,
        default: []
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);

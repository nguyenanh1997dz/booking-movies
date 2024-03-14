const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: String,
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    }]
});

module.exports = mongoose.model('Room', roomSchema);

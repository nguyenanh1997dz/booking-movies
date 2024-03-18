const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre'
        }]
    },
    cast: {
        type: [String]
    },
    director: {
        type: String
    },
    image: {
        type: Object
    },
    trailer: {
        type: String,
    },
    releaseDate: {
        type: Date
    },
    duration: {
        type: Number
    }
}, {
    timestamps: true
}
);
module.exports = mongoose.model("Movie", movieSchema);
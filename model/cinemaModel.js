const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    address:{
        type: String,
    },
    image:{
        type: Object,
    },
    phone:{
        type: String,
    },
    branches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }]
})
module.exports = mongoose.model("Cinema", cinemaSchema);
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,  
        required: true,
    },
    image: {
        type: String,  
        required: true,
    },
    status: {
        type: String,
        enum: ['còn hàng', 'hết hàng'],  
        default: "còn hàng",
    }
});

module.exports = mongoose.model("Food", foodSchema);

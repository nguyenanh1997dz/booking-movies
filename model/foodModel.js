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
        type: Object
    },
    status: {
        type: String,
        enum: ['còn hàng', 'hết hàng'],  
        default: "còn hàng",
    },
    totalSales: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Food", foodSchema);

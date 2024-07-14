const mongoose = require("mongoose");
const moment = require("moment");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minPurchase: {
        type: Number,  
        required: true,
        min: [0, 'Phải lớn hơn 0'] 
    },
    expirationDate: {
        type: Date,
        required: true,
        default: moment().add(30, 'days').toDate()
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active',
    },
    timesUsed: {
        type: Number, 
        default: 0,
        min: [0, 'Times used cannot be negative'] 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

couponSchema.pre('save', function(next) {
    if (moment().isAfter(this.expirationDate)) {
        this.status = 'expired';
    }
    next();
});

module.exports = mongoose.model("Coupon", couponSchema);

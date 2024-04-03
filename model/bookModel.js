const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest'
  },
  seats: {
    type: [Number]
  },
  price: {
    type: Number
  },
  payment:{
    method: {
      type: String,
      enum: ['Tiền mặt', 'Thẻ', 'Khác']
    },
    status: {
      type: String,
      enum: ['Chưa thanh toán', 'Đã thanh toán','Đã hủy'],
      default: 'Chưa thanh toán'
    },
    cardDetails: {
      type: {
        cardNumber: String,
        cardHolderName: String,
        expirationDate: String,
        cvv: String
      },
      required: function() {
        return this.payment.method === 'Thẻ'; 
      }
    }
  }
});

bookSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'interest',
    populate: [
      { path: 'movie' },
      { path: 'room', populate: { path: 'branch'} } 
    ]
  }).populate('branch', 'name').populate('user', 'fullName');
  next();
});


module.exports = mongoose.model('Book', bookSchema);

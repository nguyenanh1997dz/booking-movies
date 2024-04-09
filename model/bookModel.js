const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  email: {
    type: String
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
      enum: ['Tiền mặt', 'VNPAY', 'Khác']
    },
    status: {
      type: String,
      enum: ['Chưa thanh toán', 'Đã thanh toán','Đã hủy'],
      default: 'Chưa thanh toán'
    },
    details: {
      type: {Object}
    }
  }
},
  {timestamps:true}
);

bookSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'interest',
    populate: [
      { path: 'movie' },
      { path: 'room', populate: { path: 'branch'} } 
    ]
  }).populate('branch', 'name')
  next();
});


module.exports = mongoose.model('Book', bookSchema);

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  email: {
    type: String
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Movie'
  },
  uuid: { type: String, unique: true },
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
  totalPrice : {
    type: Number
  },
  discountValue: {
    type: Number,
    default: 0
  },
  extras: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food' 
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: {  
        type: Number
      }
    }
  ],
  payment:{
    method: {
      type: String,
      enum: ['Tiền mặt', 'VNPAY', 'ZALOPAY']
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
  })
  next();
});


module.exports = mongoose.model('Book', bookSchema);

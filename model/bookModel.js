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
    type: [String]
  },
  price: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Chưa thanh toán', 'Đã thanh toán'],
    default: 'Chưa thanh toán'
},
});
bookSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'interest',
    populate: {
        path: 'movie',
        select: 'name'
    }
}).populate('branch', 'name').populate('user', 'fullName');
  next();
});
module.exports = mongoose.model('Book', bookSchema);



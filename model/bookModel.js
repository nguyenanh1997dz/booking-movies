const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  interest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest'
  },
  seats: {
    type: Object
  },
  price: {
    type: Number
  }
});

module.exports = mongoose.model('Book', bookSchema);



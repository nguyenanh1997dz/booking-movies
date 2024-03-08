const mongoose = require('mongoose');
const seatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String
  }
});

module.exports = mongoose.model('Seat', seatSchema);



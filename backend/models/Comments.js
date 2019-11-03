const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Comments = new Schema({
  screenname: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    trim: true,
  },
  wifiRating: {
    type: Number,
   
  },
  coffeeRating: {
    type: Number,
    
  },
  seatingRating: {
    type: Number,
   
  },
  dateEntered: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Comments', Comments);

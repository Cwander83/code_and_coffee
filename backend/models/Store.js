const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let Store = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  wifiTotalRating: {
    type: Number,
    default: 0,
  },
  coffeeTotalRating: {
    type: Number,
    default: 0,
  },
  seatingTotalRating: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comments',
    },
  ],
  updated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Store', Store);

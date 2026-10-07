const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: [true, 'Please provide a resource ID'],
    },
    date: {
      type: String,
      required: [true, 'Please provide a booking date'],
      trim: true,
    },
    startTime: {
      type: String,
      required: [true, 'Please provide a start time'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'Please provide an end time'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);

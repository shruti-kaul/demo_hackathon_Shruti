const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a resource name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Available', 'In Use', 'Maintenance'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);

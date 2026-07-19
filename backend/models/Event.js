const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    url: { type: String, default: '' },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);

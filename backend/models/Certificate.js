const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    verifyUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);

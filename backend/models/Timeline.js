const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['education', 'experience'], required: true },
    title: { type: String, required: true }, // e.g. "Bachelor of Computer Applications (BCA)"
    organization: { type: String, required: true }, // e.g. "Vivekananda Global University"
    period: { type: String, required: true }, // e.g. "2025 - 2028"
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timeline', timelineSchema);

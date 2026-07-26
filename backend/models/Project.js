const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tags: { type: [String], default: [] }, // e.g. ["HTML", "CSS", "JavaScript"]
    codeUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

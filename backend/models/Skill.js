const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, default: 'Frontend' }, // e.g. Frontend, Programming, Design
    proficiency: { type: Number, required: true, min: 0, max: 100, default: 80 },
    description: { type: String, default: '' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);

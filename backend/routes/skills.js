const express = require('express');
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/skills
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/skills/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/skills/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

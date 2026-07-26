const express = require('express');
const Timeline = require('../models/Timeline');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/timeline
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const items = await Timeline.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/timeline
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const item = await Timeline.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/timeline/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const item = await Timeline.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Timeline entry not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/timeline/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const item = await Timeline.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Timeline entry not found' });
    res.json({ message: 'Timeline entry deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

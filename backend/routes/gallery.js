const express = require('express');
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const router = express.Router();

// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/gallery
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/gallery');
    const image = await Gallery.create({ ...req.body, imageUrl: result.secure_url });
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/gallery/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

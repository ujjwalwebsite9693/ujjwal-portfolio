const express = require('express');
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const router = express.Router();

// @route   GET /api/certificates
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/certificates
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      data.imageUrl = result.secure_url;
    }
    const certificate = await Certificate.create(data);
    res.status(201).json(certificate);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/certificates/:id
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates');
      data.imageUrl = result.secure_url;
    }
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json(certificate);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/certificates/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

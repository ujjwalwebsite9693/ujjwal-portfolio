const express = require('express');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get profile (public)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private
router.put('/', protect, async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/profile/avatar
// @desc    Upload avatar/hero image
// @access  Private
router.post('/upload/:field', protect, upload.single('image'), async (req, res, next) => {
  try {
    const { field } = req.params; // 'avatar' or 'hero'
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/profile');

    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});

    if (field === 'avatar') profile.avatarUrl = result.secure_url;
    else if (field === 'hero') profile.heroImageUrl = result.secure_url;
    else return res.status(400).json({ message: 'Invalid field. Use "avatar" or "hero".' });

    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

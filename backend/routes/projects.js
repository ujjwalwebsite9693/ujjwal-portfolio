const express = require('express');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const router = express.Router();

// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/projects
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
      data.imageUrl = result.secure_url;
    }
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
      data.imageUrl = result.secure_url;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

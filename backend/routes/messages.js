const express = require('express');
const rateLimit = require('express-rate-limit');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Too many messages sent. Please try again later.' },
});

// @route   POST /api/messages
// @desc    Submit a contact form message
// @access  Public
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const newMessage = await Message.create({ name, email, phone, message });
    res.status(201).json({ message: 'Message sent successfully! I will get back to you soon.', data: newMessage });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/messages
// @desc    Get all messages
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const mongoose = require('mongoose');

// Manually-added videos. These are merged with auto-fetched channel videos
// on the frontend, with manual entries taking priority / shown first.
const youtubeVideoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true }, // the YouTube video ID (e.g. dQw4w9WgXcQ)
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    pinned: { type: Boolean, default: true }, // pinned = manually curated, shows in "Featured" row
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);

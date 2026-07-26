const express = require('express');
const YoutubeVideo = require('../models/YoutubeVideo');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Simple in-memory cache for the auto-fetched channel videos so we don't
// hit the YouTube Data API quota on every page load.
let channelCache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function resolveChannelId(apiKey, handle) {
  const cleanHandle = handle.replace('@', '');
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${apiKey}`;
  const resp = await fetch(url);
  const json = await resp.json();
  if (json.items && json.items.length > 0) {
    return json.items[0].id;
  }
  throw new Error('Could not resolve YouTube channel ID from handle');
}

async function fetchChannelVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const handle = process.env.YOUTUBE_CHANNEL_HANDLE || '@Ujjwalmehta1';

  if (!apiKey || apiKey === 'your_youtube_data_api_key_here') {
    return []; // not configured yet
  }

  const now = Date.now();
  if (channelCache.data && now - channelCache.fetchedAt < CACHE_TTL_MS) {
    return channelCache.data;
  }

  const channelId = await resolveChannelId(apiKey, handle);

  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=12&type=video`;
  const resp = await fetch(searchUrl);
  const json = await resp.json();

  if (!json.items) return [];

  const videos = json.items.map((item) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
    pinned: false,
  }));

  channelCache = { data: videos, fetchedAt: now };
  return videos;
}

// @route   GET /api/youtube
// @desc    Get merged video list: manually pinned videos first, then auto-fetched channel videos
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const pinnedVideos = await YoutubeVideo.find().sort({ order: 1, createdAt: -1 });

    let autoVideos = [];
    try {
      autoVideos = await fetchChannelVideos();
    } catch (err) {
      console.warn('YouTube auto-fetch failed (non-fatal):', err.message);
    }

    // De-duplicate: don't show an auto-fetched video if it's already pinned manually
    const pinnedIds = new Set(pinnedVideos.map((v) => v.videoId));
    const filteredAuto = autoVideos.filter((v) => !pinnedIds.has(v.videoId));

    res.json({
      pinned: pinnedVideos,
      auto: filteredAuto,
      channelUrl: 'https://www.youtube.com/@Ujjwalmehta1',
      channelHandle: '@Ujjwalmehta1',
      channelName: "Ujjwal's Code",
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/youtube
// @desc    Manually pin a video
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const video = await YoutubeVideo.create(req.body);
    res.status(201).json(video);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/youtube/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    const video = await YoutubeVideo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/youtube/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const video = await YoutubeVideo.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

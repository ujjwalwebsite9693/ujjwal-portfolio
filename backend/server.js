require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// --- Database ---
connectDB();

// --- Core middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS ---
// Accepts a comma-separated list in CLIENT_URL so you can allow both your
// Vercel production URL and localhost during development.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: "Ujjwal's Code portfolio API is running" });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/messages', require('./routes/messages'));

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Run with: npm run seed
// Creates the first admin login + populates initial content so the site
// isn't empty on first deploy. Safe to re-run (it won't duplicate the admin).
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Timeline = require('../models/Timeline');
const YoutubeVideo = require('../models/YoutubeVideo');

const seed = async () => {
  await connectDB();

  // --- Admin account ---
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: 'Ujjwal Mehta',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  // --- Profile (singleton) ---
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({});
    console.log('Default profile created.');
  }

  // --- Skills ---
  const skillCount = await Skill.countDocuments();
  if (skillCount === 0) {
    await Skill.insertMany([
      { name: 'Frontend Development', category: 'Frontend', proficiency: 90, level: 'Advanced', description: 'HTML, CSS, JavaScript, responsive layouts, modern UI design.', order: 1 },
      { name: 'Backend Basics', category: 'Backend', proficiency: 65, level: 'Intermediate', description: 'Python / Java fundamentals, simple APIs & server logic.', order: 2 },
      { name: 'Programming Basics', category: 'Programming', proficiency: 70, level: 'Intermediate', description: 'C language calculations, storing and other logic.', order: 3 },
      { name: 'Video Editing', category: 'Creative', proficiency: 85, level: 'Advanced', description: 'Cutting, transitions, effects & thumbnails for YouTube.', order: 4 },
      { name: 'YouTube & Content', category: 'Creative', proficiency: 85, level: 'Advanced', description: 'Script writing, recording, editing & publishing tech content.', order: 5 },
      { name: 'Design', category: 'Design', proficiency: 80, level: 'Advanced', description: 'Clean layouts, color palettes, typography & simple branding.', order: 6 },
      { name: 'Databases', category: 'Backend', proficiency: 55, level: 'Intermediate', description: 'Basic understanding of SQL & data modeling.', order: 7 },
    ]);
    console.log('Sample skills created.');
  }

  // --- Timeline ---
  const timelineCount = await Timeline.countDocuments();
  if (timelineCount === 0) {
    await Timeline.insertMany([
      {
        type: 'education',
        title: 'Higher Secondary Education',
        organization: 'Bihar School Examination Board',
        period: '2022 - 2024',
        description: 'Focused on foundational computer science and mathematics.',
        order: 1,
      },
      {
        type: 'experience',
        title: 'Founder & Creator',
        organization: "Ujjwal's Code (YouTube)",
        period: '2023 - Present',
        description: 'Creating coding tutorials, tips, and project walkthroughs for aspiring developers.',
        order: 2,
      },
      {
        type: 'experience',
        title: 'Freelance Web Developer',
        organization: 'Self-employed',
        period: '2024 - Present',
        description: 'Building responsive websites and small web apps for local clients.',
        order: 3,
      },
    ]);
    console.log('Sample timeline entries created.');
  }

  // --- Projects ---
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: 'Modern E-Commerce Website',
        description:
          'A fully responsive products and services platform with smooth animations, clean UI, payments, product & order management, and full database integration.',
        tags: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        liveUrl: 'https://ujjwal.page.gd/',
        featured: true,
        order: 1,
      },
      {
        title: 'Modern Portfolio Website',
        description: 'A fully responsive portfolio with smooth animations, clean UI, and a focus on performance.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: 'https://ujjwalpage.netlify.app/',
        featured: true,
        order: 2,
      },
      {
        title: 'Mountain Hill Climb Racing Game',
        description: 'A simple mountain hill climb racing game with smooth UI and fun physics-based gameplay.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: 'https://mountainrace.netlify.app/',
        featured: true,
        order: 3,
      },
      {
        title: '2048 Game',
        description:
          '2048 is a sliding tile puzzle game where players combine numbered tiles on a 4x4 grid to reach the coveted 2048 tile.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Charts'],
        liveUrl: 'https://ujjwal2048.netlify.app/',
        featured: true,
        order: 4,
      },
      {
        title: 'Personal AI Assistant',
        description: 'An AI assistant that can search, open, or browse anything through voice or text commands.',
        tags: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: 'https://ujjwalai.netlify.app/',
        featured: true,
        order: 5,
      },
    ]);
    console.log('Sample projects created.');
  }

  // --- Certificates (placeholder - add real images via admin panel) ---
  const certCount = await Certificate.countDocuments();
  if (certCount === 0) {
    await Certificate.insertMany([
      { title: 'Introduction to AI', issuer: 'Google', year: '2026', order: 1 },
      { title: 'Generative AI', issuer: 'Google Cloud', year: '2026', order: 2 },
      { title: 'Welcome to ServiceNow', issuer: 'ServiceNow', year: '2026', order: 3 },
    ]);
    console.log('Sample certificates created.');
  }

  // --- YouTube pinned videos (add real video IDs via admin panel) ---
  const ytCount = await YoutubeVideo.countDocuments();
  if (ytCount === 0) {
    console.log('No YouTube videos seeded — add your real video IDs via the admin panel.');
  }

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

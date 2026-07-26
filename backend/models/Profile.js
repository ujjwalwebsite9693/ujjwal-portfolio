const mongoose = require('mongoose');

// Singleton document holding all "About Me" / hero / contact-facing info.
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Ujjwal Mehta' },
    roles: { type: [String], default: ['Developer', 'Creator', 'Editor'] },
    tagline: { type: String, default: "Building modern designs & digital experiences." },
    bio: {
      type: String,
      default:
        "I'm a passionate student and developer from India. I'm interested in web development, app development and design. I've learned HTML, CSS, JavaScript, C, Java and other technologies along the way.",
    },
    age: { type: String, default: '16+' },
    birthday: { type: String, default: '07 August' },
    experience: { type: String, default: '2 Years' },
    freelance: { type: String, default: 'Available' },
    languages: { type: String, default: 'Hindi, English' },
    avatarUrl: { type: String, default: '' },
    heroImageUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },

    // Contact block
    location: { type: String, default: 'Gaya, Bodh Gaya, Bihar, India, 823001' },
    email: { type: String, default: 'ujjwalcse07@gmail.com' },
    phone: { type: String, default: '+91-89872-06468' },

    // Socials
    instagram: { type: String, default: 'https://www.instagram.com/its_ujjwal.x/' },
    youtube: { type: String, default: 'https://www.youtube.com/@Ujjwalmehta1' },
    telegram: { type: String, default: 'https://t.me/ujjwal_mehta_1' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);

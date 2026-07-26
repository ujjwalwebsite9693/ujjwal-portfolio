import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiSend, FiInstagram, FiYoutube, FiSend as FiTelegram, FiGithub, FiLinkedin, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import Reveal from '../shared/Reveal';
import { StaggerGroup, StaggerItem } from '../shared/StaggerGroup';
import './Contact.css';

const SOCIAL_ICONS = {
  instagram: FiInstagram,
  youtube: FiYoutube,
  telegram: FiTelegram,
  github: FiGithub,
  linkedin: FiLinkedin,
};

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/messages', form);
      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', phone: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 2200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const socialLinks = ['instagram', 'youtube', 'telegram', 'github', 'linkedin']
    .filter((key) => profile?.[key])
    .map((key) => ({ key, url: profile[key], Icon: SOCIAL_ICONS[key] }));

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal><p className="section-eyebrow">// contact.send()</p></Reveal>
        <Reveal delay={0.08}><h2 className="section-title">Get In Touch</h2></Reveal>
        <Reveal delay={0.14}><p className="section-subtitle">Fill the form below and I'll connect with you soon!</p></Reveal>

        <div className="contact__grid">
          <Reveal direction="left" className="contact__info">
            <div className="contact__info-item">
              <span className="contact__info-icon"><FiMapPin /></span>
              <div>
                <h4>Location</h4>
                <p>{profile?.location}</p>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon"><FiMail /></span>
              <div>
                <h4>Email</h4>
                <p>{profile?.email}</p>
              </div>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-icon"><FiPhone /></span>
              <div>
                <h4>Phone</h4>
                <p>{profile?.phone}</p>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <StaggerGroup className="contact__socials">
                {socialLinks.map(({ key, url, Icon }) => (
                  <StaggerItem
                    key={key}
                    as="a"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__social-btn"
                    aria-label={key}
                  >
                    <Icon />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}
          </Reveal>

          <Reveal direction="right" delay={0.1} as="form" className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-row">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
            <motion.button
              type="submit"
              className="btn btn-primary contact__submit-btn"
              disabled={submitting}
              whileTap={{ scale: 0.96 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.span
                    key="sent"
                    className="contact__submit-inner"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    Sent <FiCheck />
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="contact__submit-inner"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {submitting ? 'Sending...' : 'Send Message'} <FiSend />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

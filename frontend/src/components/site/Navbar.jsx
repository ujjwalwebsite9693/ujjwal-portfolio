import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiTerminal } from 'react-icons/fi';
import ThemeToggle from '../shared/ThemeToggle';
import './Navbar.css';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#youtube', label: 'YouTube' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ name }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <motion.header
      className={`navbar ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container navbar__inner">
        <a href="#home" className="navbar__logo">
          <FiTerminal />
          <span>{name || 'Ujjwal'}<span className="navbar__logo-dot">.</span></span>
        </a>

        <nav className="navbar__links navbar__links--desktop">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={handleLinkClick}>
              {link.label}
            </a>
          ))}
          <a href="/admin/login" className="navbar__admin-link" onClick={handleLinkClick}>
            Admin
          </a>
        </nav>

        <div className="navbar__actions">
          <ThemeToggle />
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="navbar__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="navbar__links navbar__links--mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="/admin/login"
                className="navbar__admin-link"
                onClick={handleLinkClick}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + LINKS.length * 0.05, duration: 0.3 }}
              >
                Admin
              </motion.a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={`theme-toggle__icon ${theme === 'dark' ? 'is-active' : ''}`}>
        <FiMoon />
      </span>
      <span className={`theme-toggle__icon ${theme === 'light' ? 'is-active' : ''}`}>
        <FiSun />
      </span>
      <motion.span
        className="theme-toggle__knob"
        animate={{ x: theme === 'dark' ? 26 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--primary)' }}
      />
    </button>
  );
}

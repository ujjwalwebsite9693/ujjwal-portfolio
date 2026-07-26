import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

export default function Preloader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="preloader__logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="preloader__bracket">{'<'}</span>
            <span className="preloader__text">Ujjwal</span>
            <span className="preloader__bracket">{'/>'}</span>
          </motion.div>
          <div className="preloader__bar-track">
            <motion.div
              className="preloader__bar-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>
          <motion.p
            className="preloader__label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            booting portfolio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { AnimatePresence, motion } from 'framer-motion';

/**
 * Wraps an admin "add/edit" form so it animates open (height + fade + slide)
 * and closed, instead of abruptly appearing/disappearing. Pass `show` to
 * control visibility; children render only while shown.
 */
export default function AnimatedFormPanel({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <motion.div
            initial={{ y: -8 }}
            animate={{ y: 0 }}
            exit={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

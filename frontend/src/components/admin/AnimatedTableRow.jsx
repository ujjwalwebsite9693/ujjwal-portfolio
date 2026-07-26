import { motion, AnimatePresence } from 'framer-motion';

/**
 * Drop-in replacement for <tbody> that animates rows in/out as items are
 * added or removed. Each row must have a stable `key` matching its id.
 */
export function AnimatedTableBody({ children }) {
  return (
    <tbody>
      <AnimatePresence initial={false} mode="popLayout">
        {children}
      </AnimatePresence>
    </tbody>
  );
}

/**
 * Drop-in replacement for <tr> — wraps a table row in a motion.tr so it can
 * fade/slide in on mount and animate out on removal (must be a direct child
 * of AnimatedTableBody, and needs a `key` prop passed by the caller).
 */
export function AnimatedTableRow({ children, ...rest }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, backgroundColor: 'var(--danger)' }}
      transition={{ duration: 0.25 }}
      {...rest}
    >
      {children}
    </motion.tr>
  );
}

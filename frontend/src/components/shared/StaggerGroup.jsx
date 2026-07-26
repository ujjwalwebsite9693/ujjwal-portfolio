import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Resolve `as` to a motion-wrapped component. Supports both built-in tag
// strings ('div', 'a', 'form'...) and custom component references (e.g.
// React Router's <Link>) via motion.create().
function resolveMotionTag(as) {
  if (typeof as === 'string') {
    return motion[as] || motion.div;
  }
  if (as && typeof as === 'object' && as.__isMotionComponent) {
    return as;
  }
  return as ? motion.create(as) : motion.div;
}

/**
 * Wrap a grid/list with <StaggerGroup>, and each direct child with
 * <StaggerItem> to get a cascading reveal animation as the group scrolls
 * into view.
 */
export function StaggerGroup({ children, className = '', once = true, amount = 0.15, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', as = 'div', ...rest }) {
  const MotionTag = resolveMotionTag(as);
  return (
    <MotionTag className={className} variants={itemVariants} {...rest}>
      {children}
    </MotionTag>
  );
}

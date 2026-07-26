import { motion } from 'framer-motion';

// Resolve `as` to a motion-wrapped component. Supports both built-in tag
// strings ('div', 'a', 'form'...) and custom component references via motion.create().
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
 * Wraps children with a fade+slide-in animation that triggers once when
 * scrolled into view. Use `direction` to control the entry direction and
 * `delay` to stagger multiple items.
 */
export default function Reveal({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'none'
  delay = 0,
  duration = 0.6,
  className = '',
  as = 'div',
  once = true,
  amount = 0.2,
  ...rest
}) {
  const offset = 32;
  const variants = {
    up: { y: offset, x: 0 },
    down: { y: -offset, x: 0 },
    left: { x: offset, y: 0 },
    right: { x: -offset, y: 0 },
    none: { x: 0, y: 0 },
  };

  const MotionTag = resolveMotionTag(as);

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

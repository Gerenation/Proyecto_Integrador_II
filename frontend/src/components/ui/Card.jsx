import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Card({ children, className = '', elevated = true, ...motionProps }) {
  const reduce = useReducedMotion();
  const cls = `ui-card ${elevated ? 'ui-card--elevated' : ''} ${className}`.trim();

  if (reduce) {
    return <div className={cls}>{children}</div>;
  }

  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function PageLoader({ label = 'Cargando…' }) {
  const reduce = useReducedMotion();

  return (
    <div className="page-loader" role="status" aria-live="polite">
      {reduce ? (
        <div className="page-loader__dot-pulse" />
      ) : (
        <motion.div
          className="page-loader__ring"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.05, ease: 'linear' }}
        />
      )}
      <p className="page-loader__text">{label}</p>
    </div>
  );
}

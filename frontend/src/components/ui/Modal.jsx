import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * Modal base listo para ampliar (perfil, confirmaciones, etc.).
 */
export default function Modal({ open, title, children, onClose, footer }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="ui-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            className="ui-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'ui-modal-title' : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="ui-modal__header">
              {title ? (
                <h2 id="ui-modal-title" className="ui-modal__title">
                  {title}
                </h2>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ui-modal__close"
                onClick={onClose}
                aria-label="Cerrar"
              >
                <X size={20} />
              </Button>
            </header>
            <div className="ui-modal__body">{children}</div>
            {footer ? <footer className="ui-modal__footer">{footer}</footer> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

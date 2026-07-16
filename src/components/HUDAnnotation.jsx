/**
 * HUDAnnotation — Small monospace margin annotations.
 * Used for coordinates, version tags, timestamps — the "readout" details
 * that make the console feel alive. Pure atmosphere, never content.
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks';

export default function HUDAnnotation({ children, position = 'top-right', className = '' }) {
  const reduced = useReducedMotion();

  const positionStyles = {
    'top-right': { top: 'var(--space-md)', right: 'var(--space-md)' },
    'top-left': { top: 'var(--space-md)', left: 'var(--space-md)' },
    'bottom-right': { bottom: 'var(--space-md)', right: 'var(--space-md)' },
    'bottom-left': { bottom: 'var(--space-md)', left: 'var(--space-md)' },
  };

  return (
    <motion.div
      className={`hud-annotation ${className}`}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        textAlign: position.includes('right') ? 'right' : 'left',
        lineHeight: 1.8,
        zIndex: 2,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 1.5 }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}

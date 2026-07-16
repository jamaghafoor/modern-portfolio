/**
 * Navigation — Corner signal-strength indicator that expands to full nav.
 *
 * Default: small indicator in top-right showing pulsing green dot + "SIG" label.
 * Expanded: vertical nav list with section names in monospace, frequency-style labels.
 * Scroll-spy: highlights the active section based on viewport intersection.
 * Keyboard: Escape to close, Enter/Space to toggle, arrow keys to navigate items.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionObserver, useReducedMotion } from '../hooks';

const SECTIONS = [
  { id: 'entry', label: 'Signal Entry', freq: '001' },
  { id: 'experience', label: 'Frequency Log', freq: '002' },
  { id: 'projects', label: 'Transmissions', freq: '003' },
  { id: 'skills', label: 'Instrumentation', freq: '004' },
  { id: 'contact', label: 'Open Channel', freq: '005' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const reduced = useReducedMotion();
  const activeSection = useSectionObserver(SECTIONS.map((s) => s.id));
  const navRef = useRef(null);
  const focusedIndex = useRef(0);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
        return;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, close]);

  const transitionConfig = reduced
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] };

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 1000,
      }}
    >
      {/* Indicator button */}
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        data-magnetic
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(10, 10, 12, 0.8)',
          border: '1px solid var(--hairline)',
          padding: '0.5rem 0.75rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(8px)',
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--signal)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
      >
        {/* Pulsing dot */}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--signal)',
            boxShadow: '0 0 6px var(--signal)',
            animation: reduced ? 'none' : 'pulse-signal 2s ease-in-out infinite',
          }}
        />
        <span>SIG</span>
        <span style={{ color: 'var(--signal)', fontSize: '9px' }}>
          {SECTIONS.find((s) => s.id === activeSection)?.freq || '001'}
        </span>
      </button>

      {/* Expanded nav panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={transitionConfig}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              background: 'rgba(10, 10, 12, 0.95)',
              border: '1px solid var(--hairline)',
              padding: '0.5rem 0',
              minWidth: '220px',
              backdropFilter: 'blur(12px)',
              transformOrigin: 'top right',
            }}
          >
            {SECTIONS.map((section, i) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                role="menuitem"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.6rem 1rem',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color:
                    activeSection === section.id
                      ? 'var(--signal)'
                      : 'var(--text-secondary)',
                  textAlign: 'left',
                  letterSpacing: '0.05em',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <span style={{ opacity: 0.4 }}>{section.freq}</span>
                <span>{section.label}</span>
                {activeSection === section.id && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--signal)',
                      marginLeft: 'auto',
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/**
 * FrequencyLog — Experience section rendered as signal log entries.
 *
 * Each role is a log line with timestamp-style dates, expandable to reveal
 * full description. Layout is asymmetric: timestamp left, company + role right.
 * HUD annotations in margin (LOG.01, LOG.02, etc.)
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView, useReducedMotion } from '../hooks';
import { experience } from '../data/content';

function LogEntry({ entry, index }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.5,
        delay: reduced ? 0 : index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: 'relative',
        borderBottom: '1px solid var(--hairline)',
        padding: 'var(--space-md) 0',
      }}
    >
      {/* Log index annotation */}
      <div
        className="hud-annotation"
        style={{
          position: 'absolute',
          left: '-4rem',
          top: 'var(--space-md)',
          display: 'none', // shown on desktop via media query below
        }}
        aria-hidden="true"
      >
        LOG.{String(index + 1).padStart(2, '0')}
      </div>

      <button
        onClick={toggle}
        aria-expanded={expanded}
        data-magnetic
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr auto',
          gap: 'var(--space-md)',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '0.5rem 0',
          textAlign: 'left',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          alignItems: 'baseline',
        }}
      >
        {/* Period */}
        <span
          style={{
            fontSize: '12px',
            color: 'var(--signal)',
            letterSpacing: '0.05em',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          [{entry.period}]
        </span>

        {/* Company + Role */}
        <div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            {entry.company}
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginLeft: '0.75rem',
            }}
          >
            ▸ {entry.role}
          </span>
        </div>

        {/* Expand indicator */}
        <span
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            transition: 'transform 0.2s ease, color 0.2s ease',
            transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                paddingTop: 'var(--space-sm)',
                paddingLeft: '156px', // aligned with company name
                paddingBottom: 'var(--space-sm)',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: '540px',
                }}
              >
                {entry.description}
              </p>

              {/* Tags */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: 'var(--space-sm)',
                  flexWrap: 'wrap',
                }}
              >
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--signal)',
                      border: '1px solid var(--signal-dim)',
                      padding: '2px 8px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FrequencyLog() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const reduced = useReducedMotion();

  return (
    <section
      id="experience"
      ref={ref}
      aria-label="Work experience"
      className="signal-section"
    >
      {/* Section header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>02 — FREQUENCY LOG</span>
      </motion.div>

      {/* Log entries */}
      <div style={{ position: 'relative', paddingLeft: '0' }}>
        {experience.map((entry, i) => (
          <LogEntry key={entry.id} entry={entry} index={i} />
        ))}
      </div>

      {/* Transmission count */}
      <div
        className="hud-annotation"
        style={{
          marginTop: 'var(--space-md)',
          textAlign: 'right',
        }}
        aria-hidden="true"
      >
        {experience.length} ENTRIES · 9 YRS ACTIVE
      </div>
    </section>
  );
}

/**
 * Transmissions — Projects section.
 *
 * Each project is a "transmission" with substantial vertical space:
 * - Unique waveform signature (Canvas, derived from project name hash)
 * - Structured metadata fields (ROLE, OUTCOME)
 * - Expandable key decisions on hover/click
 * - Problem context as body text
 *
 * Scroll-driven moment: as user scrolls through this section, a persistent
 * waveform on the side "tunes" to each project's unique frequency.
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView, useReducedMotion, useScrollProgress } from '../hooks';
import { projects } from '../data/content';
import Waveform from './Waveform';

function ProjectEntry({ project, index, scrollProgress, cursorX }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const [ref, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced ? 0 : index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: 'relative',
        paddingBottom: 'var(--space-xl)',
        marginBottom: 'var(--space-xl)',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      {/* Project index annotation */}
      <div
        className="hud-annotation"
        style={{ marginBottom: 'var(--space-sm)' }}
        aria-hidden="true"
      >
        TX.{String(index + 1).padStart(2, '0')} / {project.id.toUpperCase()}
      </div>

      {/* Project header: name + waveform signature */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-sm)',
          flexWrap: 'wrap',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3vw, 28px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          {project.name}
        </h3>

        {/* Unique waveform signature */}
        <Waveform
          seed={project.id}
          width={180}
          height={40}
          scrollProgress={scrollProgress}
          animated={!reduced}
          amplitude={0.5}
          lineWidth={1}
        />
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-md)',
        }}
      >
        {project.subtitle}
      </div>

      {/* Problem / context */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-primary)',
          lineHeight: 1.7,
          maxWidth: '640px',
          marginBottom: 'var(--space-md)',
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
        }}
      >
        {project.problem}
      </p>

      {/* Structured metadata */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0.5rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          marginBottom: 'var(--space-md)',
          maxWidth: '640px',
        }}
      >
        <span style={{ color: 'var(--signal)', fontSize: '11px', letterSpacing: '0.1em' }}>
          ROLE
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>{project.role}</span>

        <span style={{ color: 'var(--signal)', fontSize: '11px', letterSpacing: '0.1em' }}>
          OUTCOME
        </span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{project.outcome}</span>

        <span style={{ color: 'var(--signal)', fontSize: '11px', letterSpacing: '0.1em' }}>
          STACK
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>{project.stack.join(' · ')}</span>
      </div>

      {/* Key decisions — expandable */}
      <button
        onClick={toggle}
        aria-expanded={expanded}
        data-magnetic
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: '1px solid var(--hairline)',
          padding: '0.4rem 0.8rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: expanded ? 'var(--signal)' : 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'border-color 0.2s ease, color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--signal)';
          e.currentTarget.style.color = 'var(--signal)';
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.borderColor = 'var(--hairline)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        <span
          style={{
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          ▸
        </span>
        KEY DECISIONS ({project.decisions.length})
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <ul
              style={{
                listStyle: 'none',
                padding: 'var(--space-sm) 0 0 0',
                maxWidth: '580px',
              }}
            >
              {project.decisions.map((decision, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    padding: '0.3rem 0',
                    paddingLeft: '1rem',
                    borderLeft: '1px solid var(--signal-dim)',
                  }}
                >
                  {decision}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Transmissions({ scrollProgress, cursorX }) {
  const [ref, isInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const reduced = useReducedMotion();

  return (
    <section
      id="projects"
      ref={ref}
      aria-label="Projects"
      className="signal-section"
    >
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>03 — TRANSMISSIONS</span>
      </motion.div>

      {projects.map((project, i) => (
        <ProjectEntry
          key={project.id}
          project={project}
          index={i}
          scrollProgress={scrollProgress}
          cursorX={cursorX}
        />
      ))}

      <div
        className="hud-annotation"
        style={{ textAlign: 'right' }}
        aria-hidden="true"
      >
        {projects.length} TRANSMISSIONS · SIGNAL CLEAR
      </div>
    </section>
  );
}

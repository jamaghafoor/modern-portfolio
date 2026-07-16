/**
 * Instrumentation — Skills section as a live console readout.
 *
 * Skills grouped by category, each rendered as a console line with a
 * signal-strength bar (horizontal bar, width proportional to depth).
 * No icons, no badges — pure typographic + bar visualization.
 * 2-column asymmetric grid on desktop, single column on mobile.
 */

import { motion } from 'framer-motion';
import { useInView, useReducedMotion } from '../hooks';
import { skills } from '../data/content';

function SkillBar({ name, strength, note, index, isInView }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.4,
        delay: reduced ? 0 : index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr auto',
        gap: '0.75rem',
        alignItems: 'center',
        padding: '0.4rem 0',
      }}
    >
      {/* Skill name */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>

      {/* Signal bar */}
      <div
        style={{
          position: 'relative',
          height: '3px',
          background: 'var(--hairline)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{
            duration: reduced ? 0 : 0.8,
            delay: reduced ? 0 : 0.2 + index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${strength}%`,
            background: 'var(--signal)',
            transformOrigin: 'left',
            boxShadow: '0 0 6px var(--signal-glow)',
          }}
        />
      </div>

      {/* Strength value + note */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          minWidth: '60px',
          textAlign: 'right',
        }}
      >
        {strength}%{note ? ` · ${note}` : ''}
      </span>
    </motion.div>
  );
}

function SkillCategory({ categoryKey, category, categoryIndex }) {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.5,
        delay: reduced ? 0 : categoryIndex * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        marginBottom: 'var(--space-lg)',
      }}
    >
      {/* Category label */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--signal)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-sm)',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {category.label}
      </div>

      {/* Skill bars */}
      {category.items.map((skill, i) => (
        <SkillBar
          key={skill.name}
          name={skill.name}
          strength={skill.strength}
          note={skill.note}
          index={i}
          isInView={isInView}
        />
      ))}
    </motion.div>
  );
}

export default function Instrumentation() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const reduced = useReducedMotion();

  const categories = Object.entries(skills);

  return (
    <section
      id="skills"
      ref={ref}
      aria-label="Technical skills"
      className="signal-section"
    >
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>04 — INSTRUMENTATION</span>
      </motion.div>

      {/* 2-column asymmetric grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-lg)',
        }}
      >
        {categories.map(([key, category], i) => (
          <SkillCategory
            key={key}
            categoryKey={key}
            category={category}
            categoryIndex={i}
          />
        ))}
      </div>

      <div
        className="hud-annotation"
        style={{ marginTop: 'var(--space-md)', textAlign: 'right' }}
        aria-hidden="true"
      >
        {categories.reduce((sum, [, cat]) => sum + cat.items.length, 0)} INSTRUMENTS ONLINE
      </div>
    </section>
  );
}

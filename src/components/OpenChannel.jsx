/**
 * OpenChannel — Contact section styled as a connection handshake.
 *
 * - Brief "establishing connection" animation sequence in mono
 * - Links styled as terminal commands: > EMAIL, > GITHUB, etc.
 * - Mechanical underline sweep on hover
 * - Console aesthetic throughout
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView, useReducedMotion } from '../hooks';
import { contact } from '../data/content';

function ConnectionSequence({ onComplete }) {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState([]);
  const sequence = [
    'INITIATING HANDSHAKE...',
    'CARRIER DETECTED',
    'ENCRYPTION: VERIFIED',
    'CHANNEL OPEN ●',
  ];

  useEffect(() => {
    if (reduced) {
      setLines(sequence);
      onComplete?.();
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLines((prev) => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 400);

    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        letterSpacing: '0.1em',
        marginBottom: 'var(--space-lg)',
        lineHeight: 2.2,
      }}
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          {line === 'CHANNEL OPEN ●' ? (
            <span style={{ color: 'var(--signal)' }}>{line}</span>
          ) : (
            line
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ContactLink({ prefix, label, href, delay }) {
  const reduced = useReducedMotion();
  const [ref, isInView] = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: reduced ? 0 : 0.4,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ marginBottom: '0.75rem' }}
    >
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        data-magnetic
        className="signal-link"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0',
        }}
      >
        <span style={{ color: 'var(--signal)', fontSize: '12px' }}>{'>'}</span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            minWidth: '80px',
          }}
        >
          {prefix}
        </span>
        <span style={{ color: 'var(--text-primary)' }}>{label}</span>
      </a>
    </motion.div>
  );
}

export default function OpenChannel() {
  const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const reduced = useReducedMotion();
  const [connectionComplete, setConnectionComplete] = useState(false);

  return (
    <section
      id="contact"
      ref={ref}
      aria-label="Contact"
      className="signal-section"
      style={{ paddingBottom: 'var(--space-2xl)' }}
    >
      <motion.div
        className="section-header"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>05 — OPEN CHANNEL</span>
      </motion.div>

      {/* Connection handshake animation */}
      {isInView && (
        <ConnectionSequence onComplete={() => setConnectionComplete(true)} />
      )}

      {/* Contact links */}
      {(connectionComplete || reduced) && (
        <div style={{ maxWidth: '480px' }}>
          <ContactLink
            prefix="EMAIL"
            label={contact.email}
            href={`mailto:${contact.email}`}
            delay={0}
          />
          <ContactLink
            prefix="GITHUB"
            label={contact.github.replace('github.com/', '')}
            href={`https://${contact.github}`}
            delay={0.05}
          />
          <ContactLink
            prefix="LINKEDIN"
            label={contact.linkedin.replace('linkedin.com/in/', '')}
            href={`https://${contact.linkedin}`}
            delay={0.1}
          />
          <ContactLink
            prefix="RESUME"
            label="Download PDF"
            href={contact.resume}
            delay={0.15}
          />
        </div>
      )}

      {/* Footer annotation */}
      <div
        className="hud-annotation"
        style={{
          marginTop: 'var(--space-2xl)',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid var(--hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <span>© 2026 ABDUL GHAFOOR</span>
        <span>SIGNAL v.2026.07 · END TRANSMISSION</span>
      </div>
    </section>
  );
}

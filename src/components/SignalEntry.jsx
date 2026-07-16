/**
 * SignalEntry — The "hero" section, reframed as a signal acquisition moment.
 *
 * - Name decrypts letter-by-letter (random glyphs → correct character)
 * - Title types out with a blinking block cursor
 * - Positioning line fades in after title completes
 * - Hero waveform trace runs across the bottom
 * - HUD annotations in the margin (version, coordinates)
 *
 * This animation sequence runs ONCE on mount, never replays.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks';
import { meta } from '../data/content';
import HUDAnnotation from './HUDAnnotation';
import Waveform from './Waveform';

// Characters to cycle through during decrypt effect
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

/**
 * DecryptText — Cycles each character through random glyphs before landing
 * on the correct letter. The "signal acquired" moment.
 */
function DecryptText({ text, startDelay = 0, duration = 1500, onComplete }) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? text : '');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (reduced) {
      onComplete?.();
      return;
    }

    const chars = text.split('');
    const resolved = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill('');
    let resolvedCount = 0;

    const timeoutId = setTimeout(() => {
      const msPerChar = duration / chars.length;
      let charIndex = 0;

      // Start cycling all characters randomly
      intervalRef.current = setInterval(() => {
        for (let i = 0; i < chars.length; i++) {
          if (!resolved[i]) {
            if (chars[i] === ' ') {
              current[i] = ' ';
            } else {
              current[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
          }
        }

        // Resolve characters sequentially
        if (charIndex < chars.length) {
          resolved[charIndex] = true;
          current[charIndex] = chars[charIndex];
          charIndex++;
          resolvedCount++;
        }

        setDisplayed(current.join(''));

        if (resolvedCount >= chars.length) {
          clearInterval(intervalRef.current);
          setDisplayed(text);
          onComplete?.();
        }
      }, msPerChar);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, startDelay, duration, reduced, onComplete]);

  return <span>{displayed}</span>;
}

/**
 * TypewriterText — Types out text character by character with a blinking cursor.
 */
function TypewriterText({ text, startDelay = 0, speed = 40, onComplete }) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? text : '');
  const [showCursor, setShowCursor] = useState(!reduced);

  useEffect(() => {
    if (reduced) {
      onComplete?.();
      return;
    }

    let index = 0;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(intervalId);
          // Keep cursor blinking for a moment, then hide
          setTimeout(() => {
            setShowCursor(false);
            onComplete?.();
          }, 1500);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, startDelay);

    return () => clearTimeout(timeoutId);
  }, [text, startDelay, speed, reduced, onComplete]);

  return (
    <span>
      {displayed}
      {showCursor && (
        <span
          style={{
            display: 'inline-block',
            width: '0.55em',
            height: '1.1em',
            background: 'var(--signal)',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            animation: 'cursor-blink 1s step-end infinite',
          }}
        />
      )}
    </span>
  );
}

export default function SignalEntry({ scrollProgress, cursorX }) {
  const reduced = useReducedMotion();
  const [nameComplete, setNameComplete] = useState(reduced);
  const [titleComplete, setTitleComplete] = useState(reduced);

  return (
    <section
      id="entry"
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--space-xl) var(--space-lg)',
        maxWidth: '1200px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* HUD annotations */}
      <HUDAnnotation position="top-right">
        <div>{meta.version}</div>
        <div>SIGNAL ACQUIRED</div>
        <div>{meta.coordinates}</div>
      </HUDAnnotation>

      <HUDAnnotation position="bottom-left">
        <div>SYS.INIT</div>
        <div>CARRIER.LOCK</div>
      </HUDAnnotation>

      {/* Main content — pushed left, asymmetric */}
      <div style={{ maxWidth: '720px' }}>
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.4 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--signal)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-md)',
          }}
        >
          ● SIGNAL ACQUIRED — DECODING TRANSMISSION
        </motion.div>

        {/* Name — decrypt animation */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--space-sm)',
            minHeight: '1.2em',
          }}
        >
          <DecryptText
            text={meta.name.toUpperCase()}
            startDelay={300}
            duration={1200}
            onComplete={() => setNameComplete(true)}
          />
        </h1>

        {/* Title — typewriter */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-lg)',
            minHeight: '1.6em',
          }}
        >
          {nameComplete && (
            <TypewriterText
              text={meta.title}
              startDelay={200}
              speed={35}
              onComplete={() => setTitleComplete(true)}
            />
          )}
        </div>

        {/* Positioning line — fade in after title */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={titleComplete ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            maxWidth: '560px',
          }}
        >
          {meta.positioning}
        </motion.p>
      </div>

      {/* Hairline separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={titleComplete ? { scaleX: 1 } : {}}
        transition={{ duration: reduced ? 0 : 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '120px',
          left: 'var(--space-lg)',
          right: 'var(--space-lg)',
          height: '1px',
          background: 'var(--hairline)',
          transformOrigin: 'left',
        }}
      />

      {/* Hero waveform trace — runs along the bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={titleComplete ? { opacity: 1 } : {}}
        transition={{ duration: reduced ? 0 : 0.8, delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: 'var(--space-lg)',
          right: 'var(--space-lg)',
        }}
      >
        <Waveform
          seed="abdul-ghafoor-hero"
          width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 64, 1136) : 1000}
          height={60}
          scrollProgress={scrollProgress}
          cursorX={cursorX}
          amplitude={0.4}
          animated={!reduced}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={titleComplete ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: 'var(--space-lg)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
}

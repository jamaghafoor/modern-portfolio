/**
 * GlitchTransition — Full-viewport overlay that fires a brief glitch
 * when sections change in the viewport.
 *
 * Effect: 2–3 frames of horizontal RGB displacement + noise, ~150ms total.
 * Uses CSS mix-blend-mode and clip-path for the displacement.
 * prefers-reduced-motion: skipped entirely (instant transition).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks';

export default function GlitchTransition() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);
  const lastSectionRef = useRef('');

  const triggerGlitch = useCallback(() => {
    if (reduced) return;
    setActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActive(false), 150);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const sectionIds = ['entry', 'experience', 'projects', 'skills', 'contact'];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && lastSectionRef.current !== id) {
            if (lastSectionRef.current !== '') {
              triggerGlitch();
            }
            lastSectionRef.current = id;
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reduced, triggerGlitch]);

  if (reduced || !active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    >
      {/* Red channel shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--glitch-red)',
          mixBlendMode: 'screen',
          opacity: 0.08,
          animation: 'glitch-shift-1 0.15s linear',
        }}
      />
      {/* Cyan channel shift */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--glitch-cyan)',
          mixBlendMode: 'screen',
          opacity: 0.06,
          animation: 'glitch-shift-2 0.15s linear',
        }}
      />
      {/* Noise overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.15,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}

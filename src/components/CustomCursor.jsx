/**
 * CustomCursor — Targeting reticle that follows the pointer.
 *
 * Visual: concentric rings with crosshair lines, like an oscilloscope probe.
 * Behavior:
 * - Linear follow with slight dampening (NOT spring physics)
 * - Magnetism: snaps to center of interactive elements on hover
 * - Scale-up + green pulse on interactive element hover
 * - Hidden on touch devices via CSS pointer: coarse
 * - Respects prefers-reduced-motion (static crosshair, no pulse)
 */

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks';

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const cursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const handleMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], [data-magnetic]');
      if (interactive) {
        setIsHovering(true);
        // Magnetism: snap to element center
        const rect = interactive.getBoundingClientRect();
        targetRef.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    };

    const handleOut = (e) => {
      const interactive = e.target.closest('a, button, [role="button"], [data-magnetic]');
      if (interactive) {
        setIsHovering(false);
      }
    };

    const handleLeave = () => {
      posRef.current = { x: -100, y: -100 };
      targetRef.current = { x: -100, y: -100 };
    };

    // Animation loop — linear dampening, NOT spring
    const lerp = (a, b, t) => a + (b - a) * t;
    const dampening = 0.15; // How quickly cursor catches up

    const animate = () => {
      const cur = posRef.current;
      const tgt = targetRef.current;

      // Linear interpolation with dampening
      cur.x = lerp(cur.x, tgt.x, reduced ? 1 : dampening);
      cur.y = lerp(cur.y, tgt.y, reduced ? 1 : dampening);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseout', handleOut, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  if (!isVisible) return null;

  const size = isHovering ? 48 : 28;
  const half = size / 2;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        // Offset so cursor center aligns with pointer
        marginLeft: -half,
        marginTop: -half,
        mixBlendMode: 'normal',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{
          transition: 'width 0.2s ease, height 0.2s ease',
          overflow: 'visible',
        }}
      >
        {/* Outer ring */}
        <circle
          cx={half}
          cy={half}
          r={half - 2}
          stroke="#39ff88"
          strokeWidth={1}
          opacity={isHovering ? 0.9 : 0.4}
          style={{ transition: 'opacity 0.2s ease, r 0.2s ease' }}
        />

        {/* Inner dot */}
        <circle
          cx={half}
          cy={half}
          r={1.5}
          fill="#39ff88"
          opacity={0.8}
        />

        {/* Crosshair lines */}
        <line x1={half} y1={2} x2={half} y2={half - 6} stroke="#39ff88" strokeWidth={0.5} opacity={0.5} />
        <line x1={half} y1={half + 6} x2={half} y2={size - 2} stroke="#39ff88" strokeWidth={0.5} opacity={0.5} />
        <line x1={2} y1={half} x2={half - 6} y2={half} stroke="#39ff88" strokeWidth={0.5} opacity={0.5} />
        <line x1={half + 6} y1={half} x2={size - 2} y2={half} stroke="#39ff88" strokeWidth={0.5} opacity={0.5} />

        {/* Corner brackets (visible on hover) */}
        {isHovering && (
          <>
            <path d={`M 4,4 L 4,10`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M 4,4 L 10,4`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M ${size-4},4 L ${size-4},10`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M ${size-4},4 L ${size-10},4`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M 4,${size-4} L 4,${size-10}`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M 4,${size-4} L 10,${size-4}`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M ${size-4},${size-4} L ${size-4},${size-10}`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
            <path d={`M ${size-4},${size-4} L ${size-10},${size-4}`} stroke="#39ff88" strokeWidth={0.75} opacity={0.6} />
          </>
        )}
      </svg>
    </div>
  );
}

/**
 * Waveform — Canvas 2D oscilloscope trace.
 *
 * The signature generative visual for the portfolio.
 * Renders an additive-synthesis waveform that can be:
 * - Animated (time-driven phase shift)
 * - Scroll-reactive (scroll position modulates frequency)
 * - Cursor-reactive (mouse X modulates phase)
 * - Static (reduced motion fallback — single frame, no loop)
 *
 * Performance: capped at 30fps via frame skipping, lazy-initialized
 * with IntersectionObserver so off-screen canvases don't burn cycles.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks';
import { generateHarmonics, drawWaveform, hashString } from '../utils/waveform';

export default function Waveform({
  seed = 'default',
  width = 600,
  height = 80,
  scrollProgress = 0,
  cursorX = 0,
  color = '#39ff88',
  lineWidth = 1.5,
  amplitude = 0.35,
  animated = true,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);
  const isVisibleRef = useRef(false);
  const reduced = useReducedMotion();

  // Generate harmonics once from seed
  const harmonics = useRef(generateHarmonics(hashString(seed))).current;

  const draw = useCallback(
    (time) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Modulate harmonics by scroll and cursor
      const modulatedHarmonics = harmonics.map((h, i) => ({
        ...h,
        frequency: h.frequency + scrollProgress * 0.5 * (i + 1),
        phase: h.phase + cursorX * 0.001 * (i % 2 === 0 ? 1 : -1),
      }));

      drawWaveform(ctx, modulatedHarmonics, canvas.width, canvas.height, time, {
        color,
        lineWidth,
        amplitude,
        glowBlur: 8,
        fade: true,
      });
    },
    [harmonics, scrollProgress, cursorX, color, lineWidth, amplitude]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution to match display size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    // We'll draw at logical dimensions, so reset width/height for drawing
    canvas.width = width;
    canvas.height = height;

    if (reduced || !animated) {
      // Reduced motion: draw one static frame
      draw(0);
      return;
    }

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Animation loop — 30fps cap
    const FPS_INTERVAL = 1000 / 30;

    const animate = (timestamp) => {
      rafRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < FPS_INTERVAL) return;

      lastFrameRef.current = timestamp - (elapsed % FPS_INTERVAL);
      timeRef.current += 0.02;

      draw(timeRef.current);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [width, height, draw, reduced, animated]);

  // Redraw when scroll or cursor changes (for static or scroll-reactive modes)
  useEffect(() => {
    if (reduced || !animated) {
      draw(timeRef.current);
    }
  }, [scrollProgress, cursorX, draw, reduced, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

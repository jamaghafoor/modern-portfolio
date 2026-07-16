/**
 * Hooks index — custom React hooks for the SIGNAL system.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ---------------------------------------------------------------
   useReducedMotion
   Reactively tracks the prefers-reduced-motion media query.
   --------------------------------------------------------------- */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* ---------------------------------------------------------------
   useScrollProgress
   Returns overall page scroll progress (0–1) and allows tracking
   per-element scroll progress via a ref.
   --------------------------------------------------------------- */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/* ---------------------------------------------------------------
   useCursorPosition
   RAF-throttled mouse tracking. Returns { x, y } in viewport coords.
   --------------------------------------------------------------- */
export function useCursorPosition() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    let ticking = false;
    let currentX = -100;
    let currentY = -100;

    const handleMove = (e) => {
      currentX = e.clientX;
      currentY = e.clientY;

      if (!ticking) {
        requestAnimationFrame(() => {
          setPos({ x: currentX, y: currentY });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return pos;
}

/* ---------------------------------------------------------------
   useInView
   Thin IntersectionObserver wrapper.
   Returns [ref, isInView, entry].
   --------------------------------------------------------------- */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([ioEntry]) => {
        setEntry(ioEntry);
        const inView = ioEntry.isIntersecting;

        if (triggerOnce && hasTriggered.current) return;

        setIsInView(inView);
        if (inView && triggerOnce) {
          hasTriggered.current = true;
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView, entry];
}

/* ---------------------------------------------------------------
   useSectionObserver
   Tracks which section is currently in the viewport.
   Used by Navigation for scroll-spy behavior.
   --------------------------------------------------------------- */
export function useSectionObserver(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds]);

  return activeSection;
}

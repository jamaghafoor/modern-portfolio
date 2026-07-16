/**
 * App.jsx — Root layout for the SIGNAL portfolio.
 *
 * Orchestrates:
 * - Global scroll progress tracking (fed to Waveform canvases)
 * - Cursor position tracking (fed to cursor and waveforms)
 * - Custom cursor overlay
 * - Navigation (fixed corner)
 * - Glitch transition overlay (between sections)
 * - Scan-line CRT overlay (atmosphere)
 * - All content sections in sequence
 *
 * The page layout is a single vertical scroll with generous spacing
 * between sections. Each section is an independent, self-contained module.
 */

import { useScrollProgress, useCursorPosition, useReducedMotion } from './hooks';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import GlitchTransition from './components/GlitchTransition';
import SignalEntry from './components/SignalEntry';
import FrequencyLog from './components/FrequencyLog';
import Transmissions from './components/Transmissions';
import Instrumentation from './components/Instrumentation';
import OpenChannel from './components/OpenChannel';

export default function App() {
  const scrollProgress = useScrollProgress();
  const cursor = useCursorPosition();
  const reduced = useReducedMotion();

  return (
    <>
      {/* Custom cursor (desktop only, hidden on touch) */}
      <CustomCursor />

      {/* Navigation — fixed corner indicator */}
      <Navigation />

      {/* Glitch transition overlay */}
      <GlitchTransition />

      {/* Scan-line CRT overlay — pure atmosphere */}
      {!reduced && <div className="scan-line-overlay" />}

      {/* Main content */}
      <main>
        {/* 01 — Signal Entry (hero) */}
        <SignalEntry
          scrollProgress={scrollProgress}
          cursorX={cursor.x}
        />

        {/* 02 — Frequency Log (experience) */}
        <FrequencyLog />

        {/* 03 — Transmissions (projects) */}
        <Transmissions
          scrollProgress={scrollProgress}
          cursorX={cursor.x}
        />

        {/* 04 — Instrumentation (skills) */}
        <Instrumentation />

        {/* 05 — Open Channel (contact) */}
        <OpenChannel />
      </main>
    </>
  );
}

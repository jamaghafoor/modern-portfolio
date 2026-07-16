/**
 * waveform.js — Pure functions for additive-synthesis waveform generation.
 *
 * Each project gets a unique waveform "signature" derived from hashing its name.
 * The oscilloscope renders these using Canvas 2D for a single, coherent generative visual.
 *
 * Key concepts:
 * - hashString: deterministic seed from any string
 * - generateHarmonics: create harmonic series from seed (frequency, amplitude, phase)
 * - sampleWaveform: compute y-value at a given x position and time
 * - drawWaveform: render a full frame to a canvas context
 */

/**
 * Simple hash function — produces a deterministic integer from a string.
 * Not cryptographic, just needs to be consistent and well-distributed.
 */
export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Generate harmonic parameters from a seed value.
 * Returns an array of { frequency, amplitude, phase } objects
 * that define a unique waveform shape via additive synthesis.
 */
export function generateHarmonics(seed, count = 5) {
  const harmonics = [];
  for (let i = 0; i < count; i++) {
    // Use the seed to deterministically vary each harmonic
    const seedMod = ((seed * (i + 1) * 2654435761) >>> 0) / 4294967296;
    harmonics.push({
      frequency: 1 + i * (0.8 + seedMod * 1.5),
      amplitude: (1 / (i + 1)) * (0.5 + seedMod * 0.5),
      phase: seedMod * Math.PI * 2,
    });
  }
  return harmonics;
}

/**
 * Sample the waveform at a given x position (0–1 normalized) and time.
 * Returns a y value in the range [-1, 1].
 */
export function sampleWaveform(harmonics, x, time = 0) {
  let y = 0;
  for (const h of harmonics) {
    y += h.amplitude * Math.sin(h.frequency * x * Math.PI * 2 + h.phase + time);
  }
  // Normalize to [-1, 1]
  const maxAmplitude = harmonics.reduce((sum, h) => sum + h.amplitude, 0);
  return maxAmplitude > 0 ? y / maxAmplitude : 0;
}

/**
 * Draw a complete waveform frame to a canvas 2D context.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} harmonics - From generateHarmonics()
 * @param {number} width - Canvas width in px
 * @param {number} height - Canvas height in px
 * @param {number} time - Animation time (drives phase shift)
 * @param {Object} options
 * @param {string} options.color - Stroke color (default: signal green)
 * @param {number} options.lineWidth - Stroke width (default: 1.5)
 * @param {number} options.glowBlur - Shadow blur for glow effect (default: 8)
 * @param {number} options.amplitude - Vertical scale multiplier (default: 0.35)
 * @param {boolean} options.fade - Apply edge fade (default: true)
 */
export function drawWaveform(ctx, harmonics, width, height, time, options = {}) {
  const {
    color = '#39ff88',
    lineWidth = 1.5,
    glowBlur = 8,
    amplitude = 0.35,
    fade = true,
  } = options;

  const centerY = height / 2;
  const step = 2; // Sample every 2px for performance

  ctx.clearRect(0, 0, width, height);

  // Glow layer (drawn first, underneath)
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glowBlur;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();

  for (let px = 0; px <= width; px += step) {
    const x = px / width;
    const y = sampleWaveform(harmonics, x, time);
    const screenY = centerY + y * height * amplitude;

    // Edge fade: reduce amplitude near edges
    let edgeFade = 1;
    if (fade) {
      const edgeDist = Math.min(px, width - px) / (width * 0.15);
      edgeFade = Math.min(1, edgeDist);
    }

    const finalY = centerY + (screenY - centerY) * edgeFade;

    if (px === 0) {
      ctx.moveTo(px, finalY);
    } else {
      ctx.lineTo(px, finalY);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Sharp line layer (on top)
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 1;
  ctx.beginPath();

  for (let px = 0; px <= width; px += step) {
    const x = px / width;
    const y = sampleWaveform(harmonics, x, time);
    const screenY = centerY + y * height * amplitude;

    let edgeFade = 1;
    if (fade) {
      const edgeDist = Math.min(px, width - px) / (width * 0.15);
      edgeFade = Math.min(1, edgeDist);
    }

    const finalY = centerY + (screenY - centerY) * edgeFade;

    if (px === 0) {
      ctx.moveTo(px, finalY);
    } else {
      ctx.lineTo(px, finalY);
    }
  }
  ctx.stroke();
  ctx.restore();

  // Center baseline (very faint)
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  ctx.restore();
}

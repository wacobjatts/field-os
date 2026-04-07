// src/branch/kinetic/renderer/decay-oscillator-painter.ts
import { DecayEvent } from '../instruments/decayoscillator';

/**
 * Decay Oscillator Painter (Baseline Distance Study)
 * Focus: Historical study of decay deviation from a nominal expected curve.
 * * Logic Mapping:
 * - X-Axis: Age of the event (newest on right, older on left).
 * - Y-Axis: Absolute decay value.
 * - Baseline: Expected decay curve for a 50% intensity signal (tau = 5000).
 * - Signal: Vertical distance (stem) from the baseline to the event dot.
 */
export function paintDecayOscillator(
  ctx: CanvasRenderingContext2D,
  events: DecayEvent[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Configuration
  const tau = 5000; // Matches instrument physics
  const baselineIntensity = 50; // Middle-ground reference intensity
  
  // Dynamic time window to ensure all historical events remain visible
  const maxAge = events.length > 0 ? Math.max(...events.map(e => e.age)) : 10000;
  const timeWindow = Math.max(10000, maxAge); // Minimum 10s view
  
  const bottomY = height * 0.85; // Anchor for 0 value
  const maxAmplitude = height * 0.7; // Vertical scale

  ctx.save();

  // --- 1. DRAW NOMINAL DECAY CURVE (The Baseline) ---
  // A smooth reference curve representing standard expected decay over time.
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(200, 210, 220, 0.4)';
  ctx.lineWidth = 1.5;
  
  for (let t = 0; t <= timeWindow; t += timeWindow / 100) {
    const x = width - (t / timeWindow) * width;
    
    // Expected decay drops exponentially as age (t) increases
    const expectedDecay = baselineIntensity * Math.exp(-t / tau);
    const y = bottomY - (expectedDecay / 100) * maxAmplitude;
    
    if (t === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();


  // --- 2. DRAW DECAY EVENTS & DISTANCE STEMS ---
  events.forEach((event: DecayEvent) => {
    const x = width - (event.age / timeWindow) * width;
    if (x < 0) return; // Cull events off-screen

    // Calculate both the actual point Y and the baseline Y at this exact age
    const dotY = bottomY - (event.decay / 100) * maxAmplitude;
    const expectedDecay = baselineIntensity * Math.exp(-event.age / tau);
    const baseY = bottomY - (expectedDecay / 100) * maxAmplitude;

    // Visual classification: Above vs Below the expected curve
    const isAbove = event.decay > expectedDecay;
    const color = isAbove ? '0, 255, 200' : '255, 120, 0'; // Cyan vs Orange
    const alpha = 0.2 + event.precision * 0.8;

    // A. Distance Stem
    // Visually anchors the dot to the baseline, emphasizing the deviation
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${color}, ${alpha * 0.5})`;
    ctx.lineWidth = 1 + event.precision * 1.5;
    ctx.setLineDash([2, 3]);
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, dotY);
    ctx.stroke();
    ctx.setLineDash([]);

    // B. Decay Node
    ctx.beginPath();
    ctx.arc(x, dotY, 2 + event.precision * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    
    // Add glow for highly precise/confident readings
    if (event.precision > 0.8) {
      ctx.shadowBlur = 8 * event.precision;
      ctx.shadowColor = `rgba(${color}, 0.8)`;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow immediately
  });

  // --- 3. HARDENING (State Reset) ---
  ctx.restore();
}

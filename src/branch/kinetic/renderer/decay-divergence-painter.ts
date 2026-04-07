// src/branch/kinetic/renderer/decay-divergence-painter.ts
import { CoilDecayPoint } from '../instruments/decaydivergence';

/**
 * Coil Decay Divergence Painter
 * Focus: Historical structural integrity and breakdown pressure.
 * * Mapping:
 * - Baseline: Equilibrium (centerY)
 * - Decay Zone: Vertical expansion ABOVE baseline (Warm)
 * - Health Zone: Vertical expansion BELOW baseline (Cool)
 * - Divergence Trace: Displacement from baseline (The Signal)
 * - Precision: Line weight and opacity (Certainty)
 */
export function paintDecayDivergenceField(
  ctx: CanvasRenderingContext2D,
  points: CoilDecayPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerY = height / 2;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const amplitude = height * 0.45;

  ctx.save();

  // --- 1. BASELINE (Equilibrium) ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // --- 2. STRUCTURAL ZONES (Decay vs Health) ---
  // These provide the context behind the divergence signal.
  // Rendered in segments to be truly history-aware.
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);

    // DECAY ZONE (Above Baseline - Breakdown Force)
    const dY1 = centerY - (p1.decay / 100) * (height * 0.25);
    const dY2 = centerY - (p2.decay / 100) * (height * 0.25);

    ctx.beginPath();
    ctx.moveTo(x1, centerY);
    ctx.lineTo(x2, centerY);
    ctx.lineTo(x2, dY2);
    ctx.lineTo(x1, dY1);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 80, 0, ${0.05 * p1.precision})`;
    ctx.fill();

    // HEALTH ZONE (Below Baseline - Structural Support)
    const hY1 = centerY + (p1.health / 100) * (height * 0.25);
    const hY2 = centerY + (p2.health / 100) * (height * 0.25);

    ctx.beginPath();
    ctx.moveTo(x1, centerY);
    ctx.lineTo(x2, centerY);
    ctx.lineTo(x2, hY2);
    ctx.lineTo(x1, hY1);
    ctx.closePath();
    ctx.fillStyle = `rgba(0, 200, 255, ${0.05 * p1.precision})`;
    ctx.fill();
  }

  // --- 3. DIVERGENCE TRACE (The Signal) ---
  // The main historical line representing structural tension.
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);

    // Divergence pushes the signal away from the baseline
    const y1 = centerY - (p1.divergence / 100) * amplitude;
    const y2 = centerY - (p2.divergence / 100) * amplitude;

    const avgPrec = (p1.precision + p2.precision) / 2;

    ctx.beginPath();
    ctx.lineWidth = 1 + avgPrec * 2.5;
    
    // Shift color slightly toward "warning" as divergence increases
    const colorMix = Math.floor(p1.divergence * 2.55);
    ctx.strokeStyle = `rgba(${150 + colorMix / 2}, 255, 255, ${0.3 + avgPrec * 0.7})`;
    
    // High divergence + High precision creates a "glow" of instability
    if (p1.divergence > 70) {
        ctx.shadowBlur = 10 * avgPrec;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // --- 4. HARDENING (State Reset) ---
  ctx.restore();
}

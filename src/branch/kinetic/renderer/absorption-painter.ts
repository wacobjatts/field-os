// src/branch/kinetic/renderer/absorption-painter.ts
import { AbsorptionPoint } from '../instruments/absorption';

/**
 * Absorption Painter (The Sink Field)
 * Focus: Energy loss and downward structural drag.
 * * Mapping:
 * - absorption -> Vertical depth (rising from top baseline downward)
 * - drain      -> Internal "flow" markers (velocity of loss)
 * - density    -> Field solidity and opacity
 * - precision  -> Edge sharpness and segment confidence
 */
export function paintAbsorption(
  ctx: CanvasRenderingContext2D,
  points: AbsorptionPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const baselineY = height * 0.1; // Surface at the top
  const maxDepth = height * 0.8;  // Max downward pull

  ctx.save();

  // --- 1. THE SURFACE HORIZON ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  ctx.stroke();

  // --- 2. SEGMENTED HISTORICAL SINK ---
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);

    // Map absorption to downward Y displacement
    const y1 = baselineY + (p1.absorption / 100) * maxDepth;
    const y2 = baselineY + (p2.absorption / 100) * maxDepth;

    const avgPrec = (p1.precision + p2.precision) / 2;
    const avgDens = (p1.density + p2.density) / 100; // Normalized 0-1
    const avgDrain = (p1.drain + p2.drain) / 100;     // Normalized 0-1

    // A. THE ABSORPTION MASS (The Volume of Loss)
    ctx.beginPath();
    ctx.moveTo(x1, baselineY);
    ctx.lineTo(x2, baselineY);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.closePath();

    // Fill opacity tied to density and precision
    const massAlpha = 0.05 + (avgDens * 0.3 * avgPrec);
    ctx.fillStyle = `rgba(0, 130, 200, ${massAlpha})`;
    ctx.fill();

    // B. THE DRAIN FLOW (Vertical Velocity Streaks)
    // Only rendered if there is significant drain velocity
    if (avgDrain > 0.3) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * avgDrain * avgPrec})`;
      
      // Vertical "drainage" lines within the segment
      const midX = (x1 + x2) / 2;
      const midY = (baselineY + (y1 + y2) / 2) / 2;
      ctx.moveTo(midX, baselineY);
      ctx.lineTo(midX, midY + (avgDrain * 10)); 
      ctx.stroke();
    }

    // C. THE SINK EDGE (The Final Limit)
    ctx.beginPath();
    ctx.lineWidth = 1.5 * avgPrec;
    
    // Clean transition from deep blue to bright cyan based on drain intensity
    const cyanFactor = 150 + (avgDrain * 105);
    ctx.strokeStyle = `rgba(0, ${cyanFactor}, 255, ${0.3 + avgPrec * 0.7})`;
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // D. PRECISION GHOSTING (Stability Indicator)
    if (avgPrec < 0.5) {
      ctx.beginPath();
      ctx.setLineDash([1, 3]);
      ctx.strokeStyle = `rgba(0, 200, 255, ${0.15 * (1 - avgPrec)})`;
      ctx.moveTo(x1, y1 + 5);
      ctx.lineTo(x2, y2 + 5);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // --- 3. HARDENING ---
  ctx.restore();
}

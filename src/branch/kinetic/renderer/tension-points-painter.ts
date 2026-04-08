// src/branch/kinetic/renderer/tension-points-painter.ts
import { TensionPoint } from '../instruments/tensionpoints';

/**
 * Tension Sampling Field Painter
 * Focus: Discrete historical tension measurements mapped vertically.
 * * Logic:
 * - Y-Axis: Tension (0 at baseline, 100 at top)
 * - X-Axis: Time (Newest on right, older on left)
 * - Point Style: Regime (Validity/Solidity)
 * - Point Size: Stability (Tightness/Scale)
 * - Opacity: Precision (Confidence)
 */
export function paintTensionPoints(
  ctx: CanvasRenderingContext2D,
  points: TensionPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (points.length < 1) return;

  // Layout bounds
  const baselineY = height * 0.9;
  const topY = height * 0.1;
  const availableHeight = baselineY - topY;
  const stepX = width / (Math.max(1, points.length - 1));

  ctx.save();

  // --- 1. DRAW FRAME (Minimal Guides) ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  // Baseline
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  // Ceiling
  ctx.moveTo(0, topY);
  ctx.lineTo(width, topY);
  ctx.stroke();

  // --- 2. DRAW POINTS (Sampling Field) ---
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = width - (i * stepX);
    const y = baselineY - (p.tension / 100) * availableHeight;

    const isHighRegime = p.regime > 50;
    const alpha = p.precision;
    
    // Stability affects radius (tightness)
    // Range: 1.5px to 4.5px
    const radius = 1.5 + (p.stability / 100) * 3;

    // A. SUBTLE STEM
    // Very faint vertical guide from baseline to the sample point
    ctx.beginPath();
    ctx.moveTo(x, baselineY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // B. POINT RENDERING
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (isHighRegime) {
      // VALID REGIME: Solid, bright, structural
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.8})`;
      ctx.fill();
      
      // High stability + High precision adds a slight core glint
      if (p.stability > 70 && alpha > 0.8) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // LOW REGIME: Ghosted, hollow, non-structural
      ctx.strokeStyle = `rgba(100, 150, 180, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Optional tiny dot in center for ghosted visibility
      ctx.fillStyle = `rgba(100, 150, 180, ${alpha * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- 3. HARDENING ---
  ctx.restore();
}


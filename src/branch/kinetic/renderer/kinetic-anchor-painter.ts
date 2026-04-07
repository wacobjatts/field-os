import { KineticAnchorPoint } from '../instruments/kineticanchor';

/**
 * Kinetic Anchor Painter (V2 - Fully Decentralized)
 * Focus: Historically accurate rendering of gravity anchors and reactive signals.
 * * Logic:
 * - Gravity Well: Historical field between anchor and equilibrium.
 * - Anchor: Segment-based smooth curve (High mass).
 * - Signal: Segment-based reactive line (Low mass).
 * - Stretch: Per-segment glow based on divergence.
 */
export function paintKineticAnchor(
  ctx: CanvasRenderingContext2D,
  points: KineticAnchorPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerY = height / 2;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const amplitude = height * 0.45;

  ctx.save();

  // --- 1. PRE-PROCESS PHYSICS (Smoothing) ---
  // We must pre-calculate the anchor positions to handle the smoothing logic
  // before we can render the segmented lines/fields.
  const anchorY: number[] = new Array(points.length);
  let currentAnchorY = centerY;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const targetY = centerY - (p.anchorStrength / 100) * amplitude;
    const k = 1 - (p.persistence / 100);
    
    // Smoothing is applied historically from right (0) to left (points.length)
    currentAnchorY = currentAnchorY + (targetY - currentAnchorY) * Math.max(k, 0.05);
    anchorY[i] = currentAnchorY;
  }

  // --- 2. THE GRAVITY WELL (Historical Field) ---
  // Rendered in segments to reflect historical significance variations.
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    const p1 = points[i];
    const p2 = points[i + 1];

    const avgSig = (p1.significance + p2.significance) / 200;
    const avgPre = (p1.precision + p2.precision) / 2;

    ctx.beginPath();
    ctx.moveTo(x1, anchorY[i]);
    ctx.lineTo(x2, anchorY[i + 1]);
    ctx.lineTo(x2, centerY);
    ctx.lineTo(x1, centerY);
    ctx.closePath();
    
    ctx.fillStyle = `rgba(0, 150, 255, ${0.08 * avgSig * avgPre})`;
    ctx.fill();
  }

  // --- 3. THE SIGNAL (Reactive Path) ---
  // Thinner, dashed, and faster reacting.
  ctx.setLineDash([2, 2]);
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    const p1 = points[i];
    const p2 = points[i + 1];

    const sigY1 = centerY - (p1.anchorStrength / 100) * amplitude;
    const sigY2 = centerY - (p2.anchorStrength / 100) * amplitude;
    const avgPre = (p1.precision + p2.precision) / 2;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * avgPre})`;
    ctx.moveTo(x1, sigY1);
    ctx.lineTo(x2, sigY2);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // --- 4. THE ANCHOR (Smooth Gravity Line) ---
  // Heavy, solid, and glowing based on divergence (stretch).
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    const p1 = points[i];
    const p2 = points[i + 1];

    const rawSigY = centerY - (p1.anchorStrength / 100) * amplitude;
    const stretch = Math.abs(rawSigY - anchorY[i]) / amplitude;
    const avgPre = (p1.precision + p2.precision) / 2;
    const avgSig = (p1.significance + p2.significance) / 200;

    ctx.beginPath();
    ctx.lineWidth = (2 + avgPre * 3);
    
    // Glow scales with stretch and significance locally
    const glow = (10 + stretch * 25) * avgPre * avgSig;
    ctx.shadowBlur = glow;
    ctx.shadowColor = `rgba(0, 180, 255, ${0.6 * avgPre})`;
    ctx.strokeStyle = `rgba(0, 220, 255, ${0.4 + avgPre * 0.6})`;

    ctx.moveTo(x1, anchorY[i]);
    ctx.lineTo(x2, anchorY[i + 1]);
    ctx.stroke();
    
    // Immediate shadow reset to prevent bleeding into next segment
    ctx.shadowBlur = 0;
  }

  // --- 5. HARDENING ---
  ctx.restore();
}


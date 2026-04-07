// src/branch/kinetic/renderer/absorption-field-painter.ts
import { AbsorptionFieldPoint } from '../instruments/absorptionfield';

/**
 * Absorption-Compression Field Painter (V2 - Fully Decentralized)
 * Focus: Localized historical study of market material states.
 */
export function paintAbsorptionField(
  ctx: CanvasRenderingContext2D,
  points: AbsorptionFieldPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerY = height / 2;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const amplitude = height * 0.4;

  ctx.save();

  // --- 1. BASELINE (Equilibrium) ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // --- 2. ABSORPTION HAZE (Localized Energy Cloud) ---
  // We render this in segments to allow historical variation in sponginess/absorption
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    
    const y1 = centerY - (p1.elasticity / 100) * amplitude;
    const y2 = centerY - (p2.elasticity / 100) * amplitude;

    const avgAbs = (p1.absorptionRate + p2.absorptionRate) / 200; // 0-1
    const avgSponge = (p1.sponginess + p2.sponginess) / 200; // 0-1
    const avgPrec = (p1.precision + p2.precision) / 2;

    const hazeSize1 = (p1.absorptionRate / 100) * (height * 0.2);
    const hazeSize2 = (p2.absorptionRate / 100) * (height * 0.2);
    const spongeMod1 = (p1.sponginess / 100) * 15;
    const spongeMod2 = (p2.sponginess / 100) * 15;

    ctx.beginPath();
    ctx.moveTo(x1, y1 - (hazeSize1 + spongeMod1));
    ctx.lineTo(x2, y2 - (hazeSize2 + spongeMod2));
    ctx.lineTo(x2, y2 + (hazeSize2 + spongeMod2));
    ctx.lineTo(x1, y1 + (hazeSize1 + spongeMod1));
    ctx.closePath();

    // Opacity and "softness" are now tied to local historical values
    const alpha = (0.02 + avgAbs * 0.15) * avgPrec;
    ctx.fillStyle = `rgba(0, 150, 255, ${alpha})`;
    ctx.fill();
  }

  // --- 3. COMPRESSION RIBBON (Localized Spring Tension) ---
  // High compression segments are thinner and more intense
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    
    const y1 = centerY - (p1.elasticity / 100) * amplitude;
    const y2 = centerY - (p2.elasticity / 100) * amplitude;

    const comp1 = p1.compression / 100;
    const comp2 = p2.compression / 100;
    const avgComp = (comp1 + comp2) / 2;
    const avgPrec = (p1.precision + p2.precision) / 2;

    const ribbonBase = height * 0.06;
    const halfWidth1 = Math.max(1.5, (ribbonBase - (comp1 * ribbonBase * 0.8)) / 2);
    const halfWidth2 = Math.max(1.5, (ribbonBase - (comp2 * ribbonBase * 0.8)) / 2);

    ctx.beginPath();
    ctx.moveTo(x1, y1 - halfWidth1);
    ctx.lineTo(x2, y2 - halfWidth2);
    ctx.lineTo(x2, y2 + halfWidth2);
    ctx.lineTo(x1, y1 + halfWidth1);
    ctx.closePath();

    // Ribbon intensity reflects historical compression at that point
    const r = Math.floor(100 + avgComp * 155);
    const b = Math.floor(200 + avgComp * 55);
    const alpha = (0.1 + avgComp * 0.5) * avgPrec;
    
    ctx.fillStyle = `rgba(${r}, 255, ${b}, ${alpha})`;
    ctx.fill();
  }

  // --- 4. ELASTICITY TRACE (Localized Spine) ---
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    const y1 = centerY - (p1.elasticity / 100) * amplitude;
    const y2 = centerY - (p2.elasticity / 100) * amplitude;

    const avgPrec = (p1.precision + p2.precision) / 2;
    const avgSponge = (p1.sponginess + p2.sponginess) / 100;

    ctx.beginPath();
    // Trace width reacts to historical sponginess (softer sponge = thinner line)
    ctx.lineWidth = (1.5 + avgPrec * 2) * (1 - avgSponge * 0.4);
    
    const color = p1.elasticity >= 0 ? '0, 255, 255' : '255, 0, 255';
    ctx.strokeStyle = `rgba(${color}, ${0.4 + avgPrec * 0.6})`;
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // --- 5. HARDENING ---
  ctx.restore();
}

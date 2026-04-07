// src/branch/kinetic/renderer/displacement-field-painter.ts
import { DisplacementPoint } from '../instruments/liarindex';

/**
 * Displacement Field Painter
 * Focus: Physical volume occupancy and equilibrium displacement.
 * * Logic Mapping:
 * - Displacement -> Height of vertical monoliths
 * - Mass -> Smooth supporting curve beneath monoliths
 * - Activity -> Color saturation and core solidity
 * - Regime -> Structural integrity (Solid vs Ghosted)
 * - Precision -> Sharpness and stroke definition
 */
export function paintDisplacementField(
  ctx: CanvasRenderingContext2D,
  points: DisplacementPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const baselineY = height * 0.85;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const maxAmplitude = height * 0.7;

  ctx.save();

  // --- 1. THE MASS (Supporting Structural Curve) ---
  // A smooth filled area representing the "grounded" portion of the displacement.
  ctx.beginPath();
  ctx.moveTo(width, baselineY);
  
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = width - (i * stepX);
    // Mass is a dampened version of displacement to feel "heavy"
    const massHeight = (p.displacement / 100) * maxAmplitude * 0.4;
    ctx.lineTo(x, baselineY - massHeight);
  }
  
  ctx.lineTo(width - (points.length - 1) * stepX, baselineY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(40, 60, 80, 0.4)';
  ctx.fill();

  // --- 2. DISPLACEMENT COLUMNS (Monoliths) ---
  // Individual events rising from the mass to their full displacement height.
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = width - (i * stepX);
    const colWidth = Math.max(2, stepX * 0.8);
    
    const h = (p.displacement / 100) * maxAmplitude;
    const y = baselineY - h;
    const isValid = p.regime > 50;

    // A. Column Body
    ctx.beginPath();
    const activityAlpha = (p.activity / 100) * (0.2 + p.precision * 0.5);
    
    if (isValid) {
      // Active Displacement: Solid monolith
      ctx.fillStyle = `rgba(0, 180, 255, ${activityAlpha})`;
      ctx.fillRect(x - colWidth / 2, y, colWidth, h);
      
      // Structural Top Cap
      ctx.strokeStyle = `rgba(200, 240, 255, ${p.precision})`;
      ctx.lineWidth = 1 + p.precision;
      ctx.strokeRect(x - colWidth / 2, y, colWidth, 1);
    } else {
      // Weak/Invalid Displacement: Ghost volume
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = `rgba(100, 120, 140, ${0.1 * p.precision})`;
      ctx.strokeRect(x - colWidth / 2, y, colWidth, h);
      ctx.setLineDash([]);
    }

    // B. Activity Core (Inner Pressure)
    if (isValid && p.activity > 10) {
      const coreH = (p.activity / 100) * h;
      const coreY = baselineY - coreH;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 * p.precision})`;
      ctx.fillRect(x - (colWidth * 0.2), coreY, colWidth * 0.4, coreH);
    }
  }

  // --- 3. EQUILIBRIUM SURFACE ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  ctx.stroke();

  ctx.restore();
}


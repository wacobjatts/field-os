// src/branch/kinetic/renderer/tension-field-painter.ts
import { AbsorptionTensionPoint } from '../instruments/tension';

/**
 * Tension Field Painter
 * Focus: Unidirectional vertical pressure and structural load on a surface.
 *
 * Logic:
 * - Tension -> Primary vertical displacement (Height above baseline)
 * - Loading -> Line thickness (Structural weight)
 * - Saturation -> Brightness and Glow (Material state)
 * - Precision -> Clarity and alpha integrity
 */
export function paintTensionField(
  ctx: CanvasRenderingContext2D,
  points: AbsorptionTensionPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const baselineY = height * 0.92;
  const maxAmplitude = height * 0.8;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);

  ctx.save();

  // --- 1. BASELINE ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  ctx.stroke();

  // --- 2. THE SURFACE MASS (Subtle Fill) ---
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = width - i * stepX;
    const x2 = width - (i + 1) * stepX;
    const p1 = points[i];
    const p2 = points[i + 1];

    const y1 = baselineY - (p1.tension / 100) * maxAmplitude;
    const y2 = baselineY - (p2.tension / 100) * maxAmplitude;

    const avgPrec = (p1.precision + p2.precision) / 2;
    const avgLoad = (p1.loading + p2.loading) / 200;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, baselineY);
    ctx.lineTo(x1, baselineY);
    ctx.closePath();

    ctx.fillStyle = `rgba(0, 200, 255, ${0.03 * avgLoad * avgPrec})`;
    ctx.fill();
  }

  // --- 3. THE TENSION LINE (Segmented Historical Render) ---
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = width - i * stepX;
    const x2 = width - (i + 1) * stepX;

    const y1 = baselineY - (p1.tension / 100) * maxAmplitude;
    const y2 = baselineY - (p2.tension / 100) * maxAmplitude;

    const avgLoading = (p1.loading + p2.loading) / 200;
    const avgSaturation = (p1.saturation + p2.saturation) / 200;
    const avgPrecision = (p1.precision + p2.precision) / 2;

    ctx.beginPath();

    ctx.lineWidth = (1 + avgLoading * 5) * avgPrecision;

    const glowStrength = avgSaturation * 12 * avgPrecision;
    ctx.shadowBlur = glowStrength;
    ctx.shadowColor = `rgba(180, 240, 255, ${avgSaturation * 0.7})`;

    const b = 255;
    const g = Math.floor(180 + avgSaturation * 75);
    const r = Math.floor(100 + avgSaturation * 155);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + avgPrecision * 0.7})`;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  // --- 4. HARDENING ---
  ctx.restore();
}

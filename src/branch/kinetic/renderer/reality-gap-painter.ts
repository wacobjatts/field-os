// src/branch/kinetic/renderer/reality-gap-painter.ts
import { RealityGapPoint } from '../instruments/realitygap';

/**
 * Reality Gap Field Painter
 * Focus: Structural integrity, signal fidelity, and reality desynchronization.
 * * Mapping:
 * - Fidelity  -> Primary internal band (Cyan)
 * - Sync      -> Inverse mapping to Gap (Violet Tearing)
 * - Freshness -> Boundary softness and structural "definition"
 * - Precision -> Per-segment alpha and stroke weight
 */
export function paintRealityGapField(
  ctx: CanvasRenderingContext2D,
  points: RealityGapPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerY = height / 2;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const maxAmplitude = height * 0.45;

  ctx.save();

  // --- 1. REALITY AXIS (Baseline) ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // --- 2. SEGMENTED FIELD RENDERING ---
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);

    // Normalized Values (0-1)
    const f1 = p1.fidelity / 100;
    const f2 = p2.fidelity / 100;
    const s1 = p1.sync / 100;
    const s2 = p2.sync / 100;
    const fr1 = p1.freshness / 100;
    const fr2 = p2.freshness / 100;
    
    const avgPrec = (p1.precision + p2.precision) / 2;
    const avgFresh = (fr1 + fr2) / 2;
    const baseAlpha = avgPrec * (0.4 + 0.6 * avgFresh);

    // Vertical displacement logic
    const fidH1 = f1 * maxAmplitude * 0.45;
    const fidH2 = f2 * maxAmplitude * 0.45;

    // The Gap (Distortion) expands AWAY from the truth band
    const gapH1 = fidH1 + (1 - s1) * maxAmplitude * 0.4;
    const gapH2 = fidH2 + (1 - s2) * maxAmplitude * 0.4;

    // --- LAYER A: GAP DISTORTION (Upper & Lower Polygons) ---
    // Rendered as clean, closed geometric manifolds
    ctx.fillStyle = `rgba(160, 40, 255, ${0.12 * baseAlpha})`;
    
    // Upper Distortion Segment
    ctx.beginPath();
    ctx.moveTo(x1, centerY - fidH1);
    ctx.lineTo(x2, centerY - fidH2);
    ctx.lineTo(x2, centerY - gapH2);
    ctx.lineTo(x1, centerY - gapH1);
    ctx.closePath();
    ctx.fill();

    // Lower Distortion Segment
    ctx.beginPath();
    ctx.moveTo(x1, centerY + fidH1);
    ctx.lineTo(x2, centerY + fidH2);
    ctx.lineTo(x2, centerY + gapH2);
    ctx.lineTo(x1, centerY + gapH1);
    ctx.closePath();
    ctx.fill();

    // --- LAYER B: FIDELITY BAND (The Truth Layer) ---
    ctx.beginPath();
    ctx.moveTo(x1, centerY - fidH1);
    ctx.lineTo(x2, centerY - fidH2);
    ctx.lineTo(x2, centerY + fidH2);
    ctx.lineTo(x1, centerY + fidH1);
    ctx.closePath();

    const fidAlpha = 0.25 + (0.4 * (f1 + f2) / 2);
    ctx.fillStyle = `rgba(0, 210, 255, ${fidAlpha * baseAlpha})`;
    ctx.fill();

    // --- LAYER C: FRESHNESS & PRECISION (Boundary Definition) ---
    // High freshness = sharp, thin lines. 
    // Low freshness = thick, soft, degraded boundaries.
    const softEdgeFactor = (1 - avgFresh);
    
    ctx.beginPath();
    ctx.lineWidth = (1 + avgPrec + softEdgeFactor * 4);
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * avgFresh * avgPrec})`;
    
    // Core boundary lines
    ctx.moveTo(x1, centerY - fidH1);
    ctx.lineTo(x2, centerY - fidH2);
    ctx.moveTo(x1, centerY + fidH1);
    ctx.lineTo(x2, centerY + fidH2);
    ctx.stroke();

    // Secondary soft "halo" for degrading freshness
    if (softEdgeFactor > 0.2) {
      ctx.beginPath();
      ctx.lineWidth = softEdgeFactor * 8;
      ctx.strokeStyle = `rgba(0, 180, 255, ${0.1 * softEdgeFactor * avgPrec})`;
      ctx.moveTo(x1, centerY - fidH1);
      ctx.lineTo(x2, centerY - fidH2);
      ctx.moveTo(x1, centerY + fidH1);
      ctx.lineTo(x2, centerY + fidH2);
      ctx.stroke();
    }

    // --- LAYER D: REALITY TEARING (Dashed Sync Indicators) ---
    const avgSync = (s1 + s2) / 2;
    if (avgSync < 0.85) {
      ctx.beginPath();
      ctx.setLineDash([2, 4 + (1 - avgFresh) * 4]);
      ctx.strokeStyle = `rgba(220, 150, 255, ${0.25 * (1 - avgSync) * avgPrec})`;
      ctx.lineWidth = 1;
      
      ctx.moveTo(x1, centerY - gapH1);
      ctx.lineTo(x2, centerY - gapH2);
      ctx.moveTo(x1, centerY + gapH1);
      ctx.lineTo(x2, centerY + gapH2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // --- 3. HARDENING ---
  ctx.restore();
}


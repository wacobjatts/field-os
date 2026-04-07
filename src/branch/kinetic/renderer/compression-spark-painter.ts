// src/branch/kinetic/renderer/compression-spark-painter.ts
import { CompressionSparkPoint } from '../instruments/compressionspark';

/**
 * Compression Spark Painter
 * Focus: Historical study of discrete release events, pressure ignition, and impulse strength.
 * * Logic Mapping:
 * - Baseline: The structural floor for all events (bottom of panel).
 * - Activation = 0: Dormant/suppressed spark (faint, ghosted tick).
 * - Activation = 100: Ignited spark (bright vertical needle).
 * - Spark: Dictates the overall height of the release.
 * - Impulse: Dictates the intensity/height of the white-hot inner core.
 * - Precision: Controls opacity and stroke confidence.
 */
export function paintCompressionSpark(
  ctx: CanvasRenderingContext2D,
  points: CompressionSparkPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (points.length < 2) return;

  const stepX = width / (points.length - 1);
  const baselineY = height * 0.85; // Fixed floor for ignition events
  const maxAmplitude = height * 0.75;

  ctx.save();

  // --- 1. BASELINE (The Pressure Floor) ---
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, baselineY);
  ctx.lineTo(width, baselineY);
  ctx.stroke();

  // --- 2. HISTORICAL SPARK EVENTS ---
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = width - (i * stepX);

    const sparkHeight = (p.spark / 100) * maxAmplitude;
    const impulseHeight = (p.impulse / 100) * maxAmplitude;
    
    const sparkY = baselineY - sparkHeight;
    const impulseY = baselineY - impulseHeight;

    const isActivated = p.activation > 50; 

    if (!isActivated) {
      // --- DORMANT STATE ---
      ctx.beginPath();
      ctx.moveTo(x, baselineY);
      ctx.lineTo(x, sparkY);
      ctx.strokeStyle = `rgba(100, 130, 150, ${0.25 * p.precision})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
    } else {
      // --- ACTIVATED STATE ---
      
      // A. The Outer Spark Aura (Cyan/Blue)
      ctx.beginPath();
      ctx.moveTo(x, baselineY);
      ctx.lineTo(x, sparkY);
      ctx.strokeStyle = `rgba(0, 220, 255, ${0.5 + p.precision * 0.5})`;
      ctx.lineWidth = 1 + p.precision * 2.5;
      ctx.stroke();

      // B. The Inner Impulse Core (White Hot with Continuous Glow)
      if (p.impulse > 0) {
        ctx.beginPath();
        ctx.moveTo(x, baselineY);
        ctx.lineTo(x, impulseY);
        
        // Physics-based glow mapping
        const glowStrength = (p.impulse / 100) * p.precision;
        
        ctx.shadowBlur = glowStrength * 12; // Scaled continuous blur
        ctx.shadowColor = `rgba(0, 255, 255, ${glowStrength * 0.8})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + p.precision * 0.3})`;
        ctx.lineWidth = 1;
        
        ctx.stroke();
        
        // Immediate reset for the next iteration
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }

      // C. Ignition Node (The Burn Mark)
      ctx.beginPath();
      ctx.arc(x, baselineY, 1.5 + p.precision, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.precision})`;
      ctx.fill();
    }
  }

  // --- 3. HARDENING ---
  ctx.restore();
}


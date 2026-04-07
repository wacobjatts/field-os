// src/branch/kinetic/renderer/stress-field-painter.ts
import { StressFieldPoint } from '../instruments/stressfield';

/**
 * Stress Field Painter (Refined)
 * Focus: Historical study of market load and packing density.
 */
export function paintStressField(
  ctx: CanvasRenderingContext2D, 
  points: StressFieldPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (points.length < 2) return;

  // Configuration
  const stepX = width / (points.length - 1);
  const baselineY = height * 0.85; // Raised for better study visibility
  const maxSignalHeight = height * 0.7;

  ctx.save();

  // 1. RENDER INSTABILITY THREAT (Top-down background bleed)
  // Provides a heat-map of historical risk zones.
  points.forEach((p, i) => {
    const x = width - (i * stepX);
    const instabilityWeight = p.instability / 100;
    
    const gradient = ctx.createLinearGradient(x, 0, x, height);
    // Warm warning color (Orange/Red) bleeding from the top
    gradient.addColorStop(0, `rgba(255, 60, 0, ${instabilityWeight * 0.35 * p.precision})`);
    gradient.addColorStop(0.4, `rgba(255, 100, 0, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x - stepX, 0, stepX + 1, height);
  });

  // 2. RENDER COMPRESSION ENVELOPE (The Packing Layer)
  ctx.beginPath();
  ctx.fillStyle = 'rgba(120, 140, 160, 0.12)';
  
  // Upper boundary of the compression band
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const x = width - (i * stepX);
    const stressY = baselineY - (p.stress / 100) * maxSignalHeight;
    // Scaled to canvas height for consistent density across resolutions
    const packingWidth = (p.compression / 100) * (height * 0.08); 
    
    if (i === 0) ctx.moveTo(x, stressY - packingWidth);
    else ctx.lineTo(x, stressY - packingWidth);
  }
  
  // Lower boundary of the compression band
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    const x = width - (i * stepX);
    const stressY = baselineY - (p.stress / 100) * maxSignalHeight;
    const packingWidth = (p.compression / 100) * (height * 0.08);
    
    ctx.lineTo(x, stressY + packingWidth);
  }
  ctx.closePath();
  ctx.fill();

  // 3. RENDER STRESS TRACE (Stable -> Hot Transition)
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    
    const y1 = baselineY - (p1.stress / 100) * maxSignalHeight;
    const y2 = baselineY - (p2.stress / 100) * maxSignalHeight;

    const avgPrecision = (p1.precision + p2.precision) / 2;
    const avgStress = (p1.stress + p2.stress) / 2;

    ctx.beginPath();
    ctx.lineWidth = 1.2 + (avgPrecision * 2.5);
    
    // Simple transition: Cyan (Stable) -> Bright White (Hot/High Stress)
    const colorMix = Math.min(100, avgStress);
    ctx.strokeStyle = `rgba(${150 + colorMix}, 255, ${255 - colorMix}, ${0.2 + avgPrecision * 0.8})`;
    
    // Deterministic glow based on compression/precision
    ctx.shadowBlur = (p1.compression / 100) * 10 * avgPrecision;
    ctx.shadowColor = ctx.strokeStyle as string;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 4. HARDENING: Reset state
  ctx.shadowBlur = 0;
  ctx.restore();
}


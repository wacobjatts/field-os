// renderer/transmission-field-painter.ts
import { TransmissionPoint } from '../instruments/transmission';

/**
 * Transmission Field Renderer (V2 - Historical Study)
 * Focus: Historical time-series of flow success vs. friction.
 * Logic:
 * - transmission = Y-offset displacement from center
 * - resistance = Amber friction haze (Envelope)
 * - expression = Line thickness/intensity (Effort)
 * - precision = Line stability/opacity (Certainty)
 */
export function paintTransmissionField(
  ctx: CanvasRenderingContext2D,
  points: TransmissionPoint[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerY = height / 2;

  if (points.length < 2) return;

  // Scale: Right-to-Left (Newest data at index 0 = right edge)
  const stepX = width / (points.length - 1);
  const maxDisplacement = height * 0.4;

  ctx.save();

  // 1. RENDER RESISTANCE ENVELOPE (The Historical Friction Field)
  // Drawn first as a background layer to avoid obscuring the core flow.
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = width - (i * stepX);
    const flowY = centerY + (p.transmission / 100) * maxDisplacement;
    
    // Friction aura width scales with resistance
    const aura = (p.resistance / 100) * (height * 0.1);
    
    if (i === 0) ctx.moveTo(x, flowY - aura);
    else ctx.lineTo(x, flowY - aura);
  });

  // Close the envelope path by tracing back along the bottom boundary
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    const x = width - (i * stepX);
    const flowY = centerY + (p.transmission / 100) * maxDisplacement;
    const aura = (p.resistance / 100) * (height * 0.1);
    ctx.lineTo(x, flowY + aura);
  }

  ctx.closePath();
  // Neutral Amber (Friction) color mapping
  ctx.fillStyle = 'rgba(255, 190, 0, 0.15)';
  ctx.fill();

  // 2. RENDER THE TRANSMISSION CONDUIT (The Historical Signal)
  // We use segment-based rendering to handle dynamic precision and color
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    const x1 = width - (i * stepX);
    const x2 = width - ((i + 1) * stepX);
    
    const y1 = centerY + (p1.transmission / 100) * maxDisplacement;
    const y2 = centerY + (p2.transmission / 100) * maxDisplacement;

    const avgPrecision = (p1.precision + p2.precision) / 2;
    const avgExpression = (p1.expression + p2.expression) / 2;

    ctx.beginPath();
    
    // Expression maps to conduit mass (thickness)
    ctx.lineWidth = 1.5 + (avgExpression / 100) * 12;
    
    // Precision maps to signal stability (dash pattern)
    if (avgPrecision < 0.8) {
        ctx.setLineDash(avgPrecision < 0.5 ? [2, 6] : [10, 5]);
    } else {
        ctx.setLineDash([]);
    }

    // Directional Color Logic
    let color = '220, 220, 220'; // Neutral
    if (p1.transmission > 5) color = '0, 255, 160';   // Upward flow
    if (p1.transmission < -5) color = '255, 60, 60';  // Downward flow
    
    const alpha = (0.3 + avgPrecision * 0.7) * (0.5 + (avgExpression / 100) * 0.5);
    ctx.strokeStyle = `rgba(${color}, ${alpha})`;

    // Core Glow (Heat of Expression)
    ctx.shadowBlur = (avgExpression / 100) * 10 * avgPrecision;
    ctx.shadowColor = `rgba(${color}, 0.6)`;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 3. HARDENING: Reset state
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  ctx.restore();
}


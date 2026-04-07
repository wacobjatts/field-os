// src/branch/kinetic/renderer/decay-oscillator-painter.ts
import { DecayEvent } from '../instruments/decayoscillator';

/**
 * Decay Oscillator Painter (Final V1)
 * Focus: Historically truthful pulse-decay curves.
 */
export function paintDecayOscillator(
  ctx: CanvasRenderingContext2D,
  events: DecayEvent[]
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  const timeWindow = 5000; // 5s visible window
  const timeScale = width / timeWindow;
  const centerY = height * 0.85; 
  const maxAmplitude = height * 0.75;
  const tau = 5000;

  ctx.save();

  // 1. DRAW IDEAL DECAY SPINE (Historical Progression)
  // This curve represents decay moving from a past birth toward the present.
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(100, 130, 150, 0.15)';
  ctx.setLineDash([4, 4]);
  
  // Plotting from birth (left) to now (right)
  for (let t = timeWindow; t >= 0; t -= 100) {
    const x = width - (t * timeScale);
    // Decay progresses as 't' (age) decreases toward 0 (now)
    const decayRef = 100 * Math.exp(-(timeWindow - t) / tau);
    const y = centerY - (decayRef / 100) * maxAmplitude;
    
    if (t === timeWindow) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]); 

  // 2. DRAW HISTORICAL EVENTS
  events.forEach((event: DecayEvent) => {
    const birthX = width - (event.age * timeScale);
    if (birthX < 0) return;

    const birthY = centerY - (event.intensity / 100) * maxAmplitude;
    const currentY = centerY - (event.decay / 100) * maxAmplitude;

    // A. Pulse Origin Point (Historical Inception)
    ctx.beginPath();
    ctx.arc(birthX, birthY, 2 + (event.precision * 2), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 255, ${event.precision * 0.5})`;
    ctx.fill();

    // B. Curved Decay Trail (BirthX → Now)
    // Renders the actual physical path of decay over the event's lifespan.
    ctx.beginPath();
    ctx.lineWidth = 1 + (event.precision * 1.5);
    
    const trailGradient = ctx.createLinearGradient(birthX, 0, width, 0);
    trailGradient.addColorStop(0, `rgba(0, 220, 255, ${event.precision * 0.6})`);
    trailGradient.addColorStop(1, `rgba(0, 150, 200, 0.05)`);
    ctx.strokeStyle = trailGradient;

    // Incrementally plot the decay curve from the historical birth to 'now'
    // This reveals the "arc" of the signal's life.
    for (let elapsed = 0; elapsed <= event.age; elapsed += 250) {
      const stepX = birthX + (elapsed * timeScale);
      const stepDecay = event.intensity * Math.exp(-elapsed / tau);
      const stepY = centerY - (stepDecay / 100) * maxAmplitude;
      
      if (elapsed === 0) ctx.moveTo(stepX, stepY);
      else ctx.lineTo(stepX, stepY);
    }

    // Ensure the path terminates exactly at the current state
    ctx.lineTo(width, currentY);
    ctx.stroke();

    // C. Current State Node (Right-edge Terminal)
    ctx.beginPath();
    ctx.arc(width, currentY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = event.precision * 0.8;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  });

  ctx.restore();
}

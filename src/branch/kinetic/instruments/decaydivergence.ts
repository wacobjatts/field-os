// src/branch/kinetic/instruments/decaydivergence.ts
import { PreparedSignal } from '../../../core/engine/signal';

export interface CoilDecayPoint {
  health: number;       // 0 → 100 (Coil Integrity)
  decay: number;        // 0 → 100 (Breakdown Pressure)
  divergence: number;   // 0 → 100 (Instability Gap)
  precision: number;    // 0 → 1   (Confidence)
  timestamp: number;    // Unix ms
}

export interface CoilDecayOutput {
  field: CoilDecayPoint[]; // Explicit time-series array
}

/**
 * Builds a historical oscillator by appending the current signal 
 * to a rolling buffer of previous states.
 */
export function buildCoilDecayOscillator(
  signal: PreparedSignal,
  history: CoilDecayPoint[] = []
): CoilDecayOutput {
  const { value, precision, timestamp } = signal;

  // Normalize absolute signal strength (0 to 1)
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // Physics Logic
  const rawHealth = norm * precision;
  const rawDecay = (1 - rawHealth) * precision;
  const rawDivergence = Math.abs(rawDecay - rawHealth);

  const newPoint: CoilDecayPoint = {
    health: rawHealth * 100,
    decay: rawDecay * 100,
    divergence: rawDivergence * 100,
    precision,
    timestamp
  };

  // Maintain a historical window (e.g., last 200 samples)
  const updatedField = [newPoint, ...history].slice(0, 200);

  return {
    field: updatedField
  };
}

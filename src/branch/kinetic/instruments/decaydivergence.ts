// instruments/decaydivergence.ts
// Coil Decay Oscillator

import { PreparedSignal } from '../../../core/engine/signal';

export interface CoilDecayPoint {
  decay: number;        // pressure weakening
  health: number;       // remaining structural health
  divergence: number;   // separation from intact state
  precision: number;
}

export interface CoilDecayOutput {
  field: CoilDecayPoint[];
}

export function buildCoilDecayOscillator(
  signal: PreparedSignal
): CoilDecayOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const decay = (1 - norm) * precision;
  const health = norm * precision;
  const divergence = Math.max(0, decay - health * 0.5);

  const point: CoilDecayPoint = {
    decay,
    health,
    divergence,
    precision
  };

  return {
    field: [point]
  };
}
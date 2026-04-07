// instruments/decaydivergence.ts
// Coil Decay Oscillator (Refined Instant Read)

import { PreparedSignal } from '../../../core/engine/signal';

export interface CoilDecayPoint {
  decay: number;        // 0 → 100 (breakdown pressure)
  health: number;       // 0 → 100 (coil integrity)
  divergence: number;   // 0 → 100 (instability gap)
  precision: number;    // 0 → 1
}

export interface CoilDecayOutput {
  field: CoilDecayPoint[];
}

export function buildCoilDecayOscillator(
  signal: PreparedSignal
): CoilDecayOutput {
  const { value, precision } = signal;

  // Normalize signal strength into 0 → 1
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // Health = structural integrity of the coil
  const rawHealth = norm * precision;

  // Decay = breakdown pressure rises as integrity weakens
  const rawDecay = (1 - rawHealth) * precision;

  // Divergence = instability gap between decay pressure and healthy structure
  const rawDivergence = Math.abs(rawDecay - rawHealth);

  return {
    field: [
      {
        decay: rawDecay * 100,
        health: rawHealth * 100,
        divergence: rawDivergence * 100,
        precision
      }
    ]
  };
}

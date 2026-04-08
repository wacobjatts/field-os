// src/branch/kinetic/instruments/decay-divergence.ts
// Decay Divergence

import { PreparedSignal } from '../../../core/engine/signal';

export interface CoilDecayPoint {
  decay: number;        // 0 → 100
  health: number;       // 0 → 100
  divergence: number;   // 0 → 100
  precision: number;    // 0 → 1
}

export interface CoilDecayOutput {
  field: CoilDecayPoint[];
}

export function buildDecayDivergence(
  signal: PreparedSignal
): CoilDecayOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const decay = (1 - norm) * precision;
  const health = norm * precision;
  const divergence = Math.max(0, decay - health * 0.5);

  return {
    field: [
      {
        decay: decay * 100,
        health: health * 100,
        divergence: divergence * 100,
        precision
      }
    ]
  };
}

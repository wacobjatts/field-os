// src/branch/kinetic/instruments/decay-divergence.ts
import { PreparedSignal } from '../../../core/engine/signal';

export interface CoilDecayPoint {
  decay: number;
  health: number;
  divergence: number;
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

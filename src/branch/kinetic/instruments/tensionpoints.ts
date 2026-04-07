// instruments/tensionpoints.ts
// Tension Line

import { PreparedSignal } from '../../../core/engine/signal';

export interface TensionPoint {
  tension: number;      // 0 → 100
  regime: number;       // 0 → 100
  stability: number;    // 0 → 100
  precision: number;    // 0 → 1
}

export interface TensionLineOutput {
  field: TensionPoint[];
}

export function buildTensionLine(
  signal: PreparedSignal
): TensionLineOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const tension = norm * precision;
  const regime = tension;
  const stability = Math.min(1, precision * (0.5 + norm * 0.5));

  return {
    field: [
      {
        tension: tension * 100,
        regime: regime * 100,
        stability: stability * 100,
        precision
      }
    ]
  };
}
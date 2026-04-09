// instruments/reality-gap.ts
// Reality Gap / Execution Integrity Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface RealityGapPoint {
  fidelity: number;      // 0 → 100
  freshness: number;     // 0 → 100
  sync: number;          // 0 → 100
  precision: number;     // 0 → 1
}

export interface RealityGapOutput {
  field: RealityGapPoint[];
}

export function buildRealityGapField(
  signal: PreparedSignal
): RealityGapOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const fidelity = norm * precision;
  const freshness = Math.min(1, 0.5 + precision * 0.5);
  const sync = Math.max(0, 1 - norm * 0.5) * precision;

  return {
    field: [
      {
        fidelity: fidelity * 100,
        freshness: freshness * 100,
        sync: sync * 100,
        precision
      }
    ]
  };
}

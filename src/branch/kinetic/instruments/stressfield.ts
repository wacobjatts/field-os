// instruments/stressfield.ts
// Stress Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface StressFieldPoint {
  stress: number;        // 0 → 100
  compression: number;   // 0 → 100
  instability: number;   // 0 → 100
  precision: number;     // 0 → 1
}

export interface StressFieldOutput {
  field: StressFieldPoint[];
}

export function buildStressField(
  signal: PreparedSignal
): StressFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const stress = norm * precision;
  const compression = Math.min(1, stress * 1.2);
  const instability = Math.max(0, stress - precision * 0.3);

  return {
    field: [
      {
        stress: stress * 100,
        compression: compression * 100,
        instability: instability * 100,
        precision
      }
    ]
  };
}
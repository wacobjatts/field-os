// instruments/stressfield.ts
// Stress Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface StressFieldPoint {
  stress: number;        // internal imbalance
  compression: number;   // how concentrated the imbalance is
  instability: number;   // how unstable the field appears
  precision: number;
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

  const point: StressFieldPoint = {
    stress,
    compression,
    instability,
    precision
  };

  return {
    field: [point]
  };
}
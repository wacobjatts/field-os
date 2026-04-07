// instruments/liarindex.ts
// Displacement Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface DisplacementPoint {
  displacement: number;   // validated deviation from structure
  regime: number;         // whether displacement is meaningful
  activity: number;       // supporting strength / event validity
  precision: number;
}

export interface DisplacementFieldOutput {
  field: DisplacementPoint[];
}

export function buildDisplacementField(
  signal: PreparedSignal
): DisplacementFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const displacement = norm * precision;
  const regime = displacement > 0.2 ? 1 : 0;
  const activity = Math.min(1, displacement * 1.5);

  const point: DisplacementPoint = {
    displacement,
    regime,
    activity,
    precision
  };

  return {
    field: [point]
  };
}
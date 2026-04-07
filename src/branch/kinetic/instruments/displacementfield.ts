// instruments/liarindex.ts
// Displacement Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface DisplacementPoint {
  displacement: number;   // 0 → 100
  regime: number;         // 0 or 100
  activity: number;       // 0 → 100
  precision: number;      // 0 → 1
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

  return {
    field: [
      {
        displacement: displacement * 100,
        regime: regime * 100,
        activity: activity * 100,
        precision
      }
    ]
  };
}
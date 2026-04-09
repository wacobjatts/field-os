// src/branch/kinetic/instruments/absorption-field.ts
// Physics: Absorption–Compression Field (A3 Core)
// Registry: AbsorptionField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

export interface AbsorptionFieldPoint {
  compression: number;      // Raw 0 -> 1
  absorptionRate: number;   // Raw 0 -> 1
  elasticity: number;       // Raw -1 -> 1
  sponginess: number;       // Raw 0 -> 1
  precision: number;
}

export interface AbsorptionFieldOutput {
  field: AbsorptionFieldPoint[];
}

export function buildAbsorptionField(
  signal: PreparedSignal
): AbsorptionFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(-1, Math.min(1, value / 100));

  const compression = Math.max(0, norm * precision);
  const absorptionRate = Math.abs(norm) * precision;
  const elasticity = norm;
  const sponginess = 1 - Math.min(1, compression);

  return {
    field: [{
      compression,
      absorptionRate,
      elasticity,
      sponginess,
      precision
    }]
  };
}

// src/branch/kinetic/instruments/absorption-tension.ts
// Physics: Absorption–Tension Field (A3 Core)
// Registry: AbsorptionTension
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

export interface AbsorptionFieldPoint {
  compression: number;
  absorptionRate: number;
  elasticity: number;
  sponginess: number;
  precision: number;
}

export interface AbsorptionFieldOutput {
  field: AbsorptionFieldPoint[];
}

export function buildAbsorptionTension(
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

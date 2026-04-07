// instruments/absorptionfield.ts
// Absorption–Compression Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface AbsorptionFieldPoint {
  compression: number;      // 0 → 100
  absorptionRate: number;   // 0 → 100
  elasticity: number;       // -100 → 100
  sponginess: number;       // 0 → 100
  precision: number;        // 0 → 1
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
    field: [
      {
        compression: compression * 100,
        absorptionRate: absorptionRate * 100,
        elasticity: elasticity * 100,
        sponginess: sponginess * 100,
        precision
      }
    ]
  };
}
// instruments/absorptionfield.ts
// Absorption–Compression Field (A3)
// Clean, stable, physically-aligned interpretation layer

import { PreparedSignal } from '../../../core/engine/signal';

export interface AbsorptionFieldPoint {
  compression: number;      // density (mist)
  absorptionRate: number;  // curve behavior
  elasticity: number;      // structural response (-1 → 1)
  sponginess: number;      // capacity (0 → 1)
  precision: number;       // signal reliability
}

export interface AbsorptionFieldOutput {
  field: AbsorptionFieldPoint[];
}

export function buildAbsorptionTension(
  signal: PreparedSignal
): AbsorptionFieldOutput {

  const value = signal.value;
  const precision = signal.precision;

  // --- NORMALIZATION ---
  const norm = Math.max(-1, Math.min(1, value / 100));

  // --- CORE INTERPRETATION ---

  // Compression (mist density)
  const compression = Math.max(0, norm * precision);

  // Absorption rate (curve sharpness / activity)
  const absorptionRate = Math.abs(norm) * precision;

  // Elasticity (structural response)
  const elasticity = norm;

  // Sponginess (capacity)
  const sponginess = 1 - Math.min(1, compression);

  const point: AbsorptionFieldPoint = {
    compression,
    absorptionRate,
    elasticity,
    sponginess,
    precision
  };

  return {
    field: [point]
  };
}

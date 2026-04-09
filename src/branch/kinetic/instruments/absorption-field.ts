// src/branch/kinetic/instruments/absorption-field.ts
import { PreparedSignal } from '../../../core/engine/signal';

/** * REGISTRY NAME: AbsorptionFieldPoint
 * Verified Source of Truth 
 */
export interface AbsorptionFieldPoint {
  compression: number;      // Raw Physics: 0 → 1
  absorptionRate: number;   // Raw Physics: 0 → 1
  elasticity: number;       // Raw Physics: -1 → 1
  sponginess: number;       // Raw Physics: 0 → 1
  precision: number;        // Raw Physics: 0 → 1
}

export interface AbsorptionFieldOutput {
  field: AbsorptionFieldPoint[];
}

/** * REGISTRY NAME: buildAbsorptionField
 * Mandatory build entry point. Do not rename.
 */
export function buildAbsorptionField(
  signal: PreparedSignal
): AbsorptionFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  // A3 Physics: Normalize signal (Value/100) to find the -1 to 1 pivot
  const norm = Math.max(-1, Math.min(1, value / 100));

  // INTERNAL PHYSICS LOGIC (From original absorption.ts)
  // Maintaining raw decimals for calculators and history files.
  const compression = Math.max(0, norm * precision);
  const absorptionRate = Math.abs(norm) * precision;
  const elasticity = norm;
  const sponginess = 1 - Math.min(1, compression);

  return {
    field: [
      {
        compression,      // 0-1 Raw
        absorptionRate,   // 0-1 Raw
        elasticity,       // -1 to 1 Raw
        sponginess,       // 0-1 Raw
        precision         // 0-1 Raw
      }
    ]
  };
}

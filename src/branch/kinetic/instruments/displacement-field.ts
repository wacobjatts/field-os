// src/branch/kinetic/instruments/displacement-field.ts
// Physics: Displacement Field (A3 Core)
// Registry: DisplacementField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: DisplacementPoint
 * Verified Source of Truth
 */
export interface DisplacementPoint {
  displacement: number;   // Raw Physics: 0 → 1
  regime: number;         // Raw Physics: 0 or 1
  activity: number;       // Raw Physics: 0 → 1
  precision: number;      // Raw Physics: 0 → 1
}

export interface DisplacementFieldOutput {
  field: DisplacementPoint[];
}

/**
 * REGISTRY NAME: buildDisplacementField
 * Mandatory entry point for Kinetic build.
 */
export function buildDisplacementField(
  signal: PreparedSignal
): DisplacementFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  // Normalizing signal value to reach the 0 to 1 physics range
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  // No simplification. Raw decimals preserved for calculators/history.
  const displacement = norm * precision;
  
  // Regime: Binary trigger based on displacement intensity
  const regime = displacement > 0.2 ? 1 : 0;
  
  // Activity: Scaled response capped at structural maximum
  const activity = Math.min(1, displacement * 1.5);

  return {
    field: [
      {
        displacement, // Removed * 100
        regime,       // Removed * 100
        activity,     // Removed * 100
        precision
      }
    ]
  };
}

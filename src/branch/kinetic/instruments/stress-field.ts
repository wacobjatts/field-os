// src/branch/kinetic/instruments/stress-field.ts
// Physics: Stress Field (A3 Core)
// Registry: StressField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: StressFieldPoint
 * Verified Source of Truth
 */
export interface StressFieldPoint {
  stress: number;        // Raw Physics: 0 → 1
  compression: number;   // Raw Physics: 0 → 1
  instability: number;   // Raw Physics: 0 → 1
  precision: number;     // Raw Physics: 0 → 1
}

export interface StressFieldOutput {
  field: StressFieldPoint[];
}

/**
 * REGISTRY NAME: buildStressField
 * Mandatory entry point for Kinetic build.
 */
export function buildStressField(
  signal: PreparedSignal
): StressFieldOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  const stress = norm * precision;
  const compression = Math.min(1, stress * 1.2);
  const instability = Math.max(0, stress - precision * 0.3);

  return {
    field: [
      {
        stress,       // Removed * 100
        compression,  // Removed * 100
        instability,  // Removed * 100
        precision
      }
    ]
  };
}

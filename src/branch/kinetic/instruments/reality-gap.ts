// src/branch/kinetic/instruments/reality-gap.ts
// Physics: Reality Gap / Execution Integrity Field (A3 Core)
// Registry: RealityGapField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: RealityGapPoint
 * Verified Source of Truth
 */
export interface RealityGapPoint {
  fidelity: number;      // Raw Physics: 0 → 1
  freshness: number;     // Raw Physics: 0 → 1
  sync: number;          // Raw Physics: 0 → 1
  precision: number;     // Raw Physics: 0 → 1
}

export interface RealityGapOutput {
  field: RealityGapPoint[];
}

/**
 * REGISTRY NAME: buildRealityGapField
 * Mandatory entry point for Kinetic build.
 */
export function buildRealityGapField(
  signal: PreparedSignal
): RealityGapOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  // Maintaining raw decimals exactly as specified in original A3 logic
  const fidelity = norm * precision;
  
  // Freshness: structural baseline + precision influence
  const freshness = Math.min(1, 0.5 + precision * 0.5);
  
  // Sync: inverse relationship to signal intensity
  const sync = Math.max(0, 1 - norm * 0.5) * precision;

  return {
    field: [
      {
        fidelity,   // Removed * 100
        freshness,  // Removed * 100
        sync,       // Removed * 100
        precision
      }
    ]
  };
}

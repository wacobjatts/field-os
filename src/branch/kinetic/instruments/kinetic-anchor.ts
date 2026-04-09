// src/branch/kinetic/instruments/kinetic-anchor.ts
// Physics: Kinetic Anchor (A3 Core)
// Registry: KineticAnchor
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: KineticAnchorPoint
 * Verified Source of Truth
 */
export interface KineticAnchorPoint {
  anchorStrength: number;  // Raw Physics: 0 → 1
  persistence: number;     // Raw Physics: 0 → 1
  significance: number;    // Raw Physics: 0 → 1
  precision: number;       // Raw Physics: 0 → 1
}

export interface KineticAnchorOutput {
  field: KineticAnchorPoint[];
}

/**
 * REGISTRY NAME: buildKineticAnchor
 * Mandatory entry point for Kinetic build.
 */
export function buildKineticAnchor(
  signal: PreparedSignal
): KineticAnchorOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  const anchorStrength = norm * precision;
  
  // Persistence: structural baseline of 0.4 + strength influence
  const persistence = Math.min(1, 0.4 + anchorStrength * 0.6);
  
  // Significance: product of strength and signal precision
  const significance = anchorStrength * precision;

  return {
    field: [
      {
        anchorStrength, // Removed * 100
        persistence,    // Removed * 100
        significance,   // Removed * 100
        precision
      }
    ]
  };
}

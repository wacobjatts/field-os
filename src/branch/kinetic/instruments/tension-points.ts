// src/branch/kinetic/instruments/tension-points.ts
// Physics: Tension Points (A3 Core)
// Registry: TensionPoints
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: TensionPoint
 * Verified Source of Truth
 */
export interface TensionPoint {
  tension: number;      // Raw Physics: 0 → 1
  regime: number;       // Raw Physics: 0 → 1
  stability: number;    // Raw Physics: 0 → 1
  precision: number;    // Raw Physics: 0 → 1
}

export interface TensionPointsOutput {
  field: TensionPoint[];
}

/**
 * REGISTRY NAME: buildTensionPoints
 * Mandatory entry point for Kinetic build.
 */
export function buildTensionPoints(
  signal: PreparedSignal
): TensionPointsOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  const tension = norm * precision;
  
  // Regime: Direct mapping of tension in this instrument
  const regime = tension;
  
  // Stability: Precision-weighted influence of the normalization curve
  const stability = Math.min(1, precision * (0.5 + norm * 0.5));

  return {
    field: [
      {
        tension,    // Removed * 100
        regime,     // Removed * 100
        stability,  // Removed * 100
        precision
      }
    ]
  };
}

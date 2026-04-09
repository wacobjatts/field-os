// src/branch/kinetic/instruments/tension-line.ts
// Physics: Absorption Tension Line (A3 Core)
// Registry: TensionLine
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: TensionLinePoint
 * Verified Source of Truth
 */
export interface TensionLinePoint {
  tension: number;       // Raw Physics: 0 → 1
  loading: number;       // Raw Physics: 0 → 1
  saturation: number;    // Raw Physics: 0 → 1
  precision: number;     // Raw Physics: 0 → 1
}

export interface TensionLineOutput {
  field: TensionLinePoint[];
}

/**
 * REGISTRY NAME: buildTensionLine
 * Mandatory entry point for Kinetic build.
 * Merges buildAbsorptionTension logic with buildTensionLine registry.
 */
export function buildTensionLine(
  signal: PreparedSignal
): TensionLineOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  // Using the more complex physics from tension.ts.ts but outputting raw decimals
  const tension = norm * precision;
  const loading = Math.min(1, tension * 1.1);
  const saturation = Math.max(0, loading - 0.2);

  return {
    field: [
      {
        tension,    // Removed * 100
        loading,    // Removed * 100
        saturation, // Removed * 100
        precision
      }
    ]
  };
}

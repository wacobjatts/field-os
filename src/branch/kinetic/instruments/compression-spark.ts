// src/branch/kinetic/instruments/compression-spark.ts
// Physics: Compression Spark (A3 Core)
// Registry: CompressionSpark
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

export interface CompressionSparkPoint {
  spark: number;        // Raw Physics: 0 → 1
  activation: number;   // Raw Physics: 0 (Off) or 1 (On)
  impulse: number;      // Raw Physics: 0 → 1
  precision: number;    // Raw Physics: 0 → 1
}

export interface CompressionSparkOutput {
  field: CompressionSparkPoint[];
}

/** * REGISTRY NAME: buildCompressionSpark
 * Mandatory entry point for Kinetic build.
 */
export function buildCompressionSpark(
  signal: PreparedSignal
): CompressionSparkOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  // Signals are absolute for spark intensity, normalized against 100 base
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  // No simplification. Raw decimals preserved for calculators/history.
  const spark = norm * precision;
  
  // Activation Threshold: Binary trigger at 0.2 intensity
  const activation = spark > 0.2 ? 1 : 0;
  
  // Impulse: Accelerated reaction (1.5x) capped at structural maximum
  const impulse = Math.min(1, spark * 1.5);

  return {
    field: [
      {
        spark,      // Raw 0-1
        activation, // Raw 0 or 1
        impulse,    // Raw 0-1
        precision   // Raw 0-1
      }
    ]
  };
}

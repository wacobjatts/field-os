// instruments/compressionspark.ts
// Compression Spark

import { PreparedSignal } from '../../../core/engine/signal';

export interface CompressionSparkPoint {
  spark: number;        // 0 → 100
  activation: number;   // 0 or 100
  impulse: number;      // 0 → 100
  precision: number;    // 0 → 1
}

export interface CompressionSparkOutput {
  field: CompressionSparkPoint[];
}

export function buildCompressionSpark(
  signal: PreparedSignal
): CompressionSparkOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const spark = norm * precision;
  const activation = spark > 0.2 ? 1 : 0;
  const impulse = Math.min(1, spark * 1.5);

  return {
    field: [
      {
        spark: spark * 100,
        activation: activation * 100,
        impulse: impulse * 100,
        precision
      }
    ]
  };
}

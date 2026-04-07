// instruments/compressionspark.ts
// Compression Spark

import { PreparedSignal } from '../../../core/engine/signal';

export interface CompressionSparkPoint {
  spark: number;        // release intensity
  activation: number;   // whether pressure is firing
  impulse: number;      // sharpness of release
  precision: number;
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

  const point: CompressionSparkPoint = {
    spark,
    activation,
    impulse,
    precision
  };

  return {
    field: [point]
  };
}
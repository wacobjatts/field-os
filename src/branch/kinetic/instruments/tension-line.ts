// src/branch/kinetic/instruments/tension-line.ts
import { PreparedSignal } from '../../../core/engine/signal';

export interface TensionLinePoint {
  tension: number;
  precision: number;
}

export interface TensionLineOutput {
  field: TensionLinePoint[];
}

export function buildTensionLine(
  signal: PreparedSignal
): TensionLineOutput {
  const value = signal.value;
  const precision = signal.precision;
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  return {
    field: [{
      tension: norm * precision * 100,
      precision
    }]
  };
}

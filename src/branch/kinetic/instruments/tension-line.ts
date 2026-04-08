// src/branch/kinetic/instruments/tension-line.ts
import { PreparedSignal } from '../../../core/engine/signal';

export interface TensionLinePoint {
  tension: number;
  precision: number;
}

export interface TensionLineOutput {
  field: TensionLinePoint[];
}

export interface AbsorptionTensionPoint {
  tension: number;
  loading: number;
  saturation: number;
  precision: number;
}

export interface AbsorptionTensionOutput {
  field: AbsorptionTensionPoint[];
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

export function buildAbsorptionTension(
  signal: PreparedSignal
): AbsorptionTensionOutput {
  const value = signal.value;
  const precision = signal.precision;
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const tension = norm * precision;
  const loading = Math.min(1, tension * 1.1);
  const saturation = Math.max(0, loading - 0.2);

  return {
    field: [{
      tension: tension * 100,
      loading: loading * 100,
      saturation: saturation * 100,
      precision
    }]
  };
}

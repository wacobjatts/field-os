// instruments/absorption-tension.ts
// Absorption Tension

import { PreparedSignal } from '../../../core/engine/signal';

export interface AbsorptionTensionPoint {
  tension: number;       // 0 → 100
  loading: number;       // 0 → 100
  saturation: number;    // 0 → 100
  precision: number;     // 0 → 1
}

export interface AbsorptionTensionOutput {
  field: AbsorptionTensionPoint[];
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
    field: [
      {
        tension: tension * 100,
        loading: loading * 100,
        saturation: saturation * 100,
        precision
      }
    ]
  };
}

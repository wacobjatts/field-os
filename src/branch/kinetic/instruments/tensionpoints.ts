// instruments/tensionpoints.ts
// Tension Line

import { PreparedSignal } from '../../../core/engine/signal';

export interface TensionPoint {
  tension: number;      // valid stored pressure
  regime: number;       // simplified state strength
  stability: number;    // how intact the pressure looks
  precision: number;
}

export interface TensionLineOutput {
  field: TensionPoint[];
}

export function buildTensionLine(
  signal: PreparedSignal
): TensionLineOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const tension = norm * precision;
  const regime = tension;
  const stability = Math.min(1, precision * (0.5 + norm * 0.5));

  const point: TensionPoint = {
    tension,
    regime,
    stability,
    precision
  };

  return {
    field: [point]
  };
}
// instruments/transmission.ts
// Absorption Transmission Field

import { PreparedSignal } from '../../../core/engine/signal';

export interface TransmissionPoint {
  transmission: number;   // -100 → 100
  resistance: number;     // 0 → 100
  expression: number;     // 0 → 100
  precision: number;      // 0 → 1
}

export interface TransmissionOutput {
  field: TransmissionPoint[];
}

export function buildTransmissionField(
  signal: PreparedSignal
): TransmissionOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(-1, Math.min(1, value / 100));

  const transmission = norm * precision;
  const resistance = 1 - Math.abs(transmission);
  const expression = Math.abs(norm) * precision;

  return {
    field: [
      {
        transmission: transmission * 100,
        resistance: resistance * 100,
        expression: expression * 100,
        precision
      }
    ]
  };
}
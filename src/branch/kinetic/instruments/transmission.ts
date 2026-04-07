// instruments/transmission.ts
// Absorption Transmission Field (A7)

import { PreparedSignal } from '../../../core/engine/signal';

export interface TransmissionPoint {
  transmission: number;     // flow passing through structure
  resistance: number;       // structural blocking
  expression: number;       // visible movement correlation
  precision: number;
}

export interface TransmissionOutput {
  field: TransmissionPoint[];
}

export function buildTransmissionField(
  signal: PreparedSignal
): TransmissionOutput {

  const value = signal.value;
  const precision = signal.precision;

  // --- NORMALIZATION ---
  const norm = Math.max(-1, Math.min(1, value / 100));

  // --- CORE INTERPRETATION ---

  // Transmission (what gets through)
  const transmission = norm * precision;

  // Resistance (inverse of transmission)
  const resistance = 1 - Math.abs(transmission);

  // Expression (visible effect strength)
  const expression = Math.abs(norm) * precision;

  const point: TransmissionPoint = {
    transmission,
    resistance,
    expression,
    precision
  };

  return {
    field: [point]
  };
}
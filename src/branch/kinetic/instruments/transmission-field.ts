// src/branch/kinetic/instruments/transmission-field.ts
// Physics: Absorption Transmission Field (A3 Core)
// Registry: TransmissionField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/**
 * REGISTRY NAME: TransmissionPoint
 * Verified Source of Truth
 */
export interface TransmissionPoint {
  transmission: number;   // Raw Physics: -1 → 1
  resistance: number;     // Raw Physics: 0 → 1
  expression: number;     // Raw Physics: 0 → 1
  precision: number;      // Raw Physics: 0 → 1
}

export interface TransmissionOutput {
  field: TransmissionPoint[];
}

/**
 * REGISTRY NAME: buildTransmissionField
 * Mandatory entry point for Kinetic build.
 */
export function buildTransmissionField(
  signal: PreparedSignal
): TransmissionOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  // Normalizing signal value to reach the -1 to 1 physics range
  const norm = Math.max(-1, Math.min(1, value / 100));

  // --- CORE PHYSICS LOGIC ---
  const transmission = norm * precision;
  
  // Resistance: Inverse of absolute transmission intensity
  const resistance = 1 - Math.abs(transmission);
  
  // Expression: Absolute normalized value weighted by precision
  const expression = Math.abs(norm) * precision;

  return {
    field: [
      {
        transmission, // Removed * 100
        resistance,   // Removed * 100
        expression,   // Removed * 100
        precision
      }
    ]
  };
}

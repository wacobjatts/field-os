// src/branch/kinetic/instruments/decay-divergence.ts
// Physics: Coil Decay Oscillator (A3 Core)
// Registry: CoilDecayOscillator
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/** * REGISTRY NAME: CoilDecayPoint
 * Verified Source of Truth 
 */
export interface CoilDecayPoint {
  decay: number;        // Raw Physics: 0 → 1
  health: number;       // Raw Physics: 0 → 1
  divergence: number;   // Raw Physics: 0 → 1
  precision: number;    // Raw Physics: 0 → 1
}

export interface CoilDecayOutput {
  field: CoilDecayPoint[];
}

/** * REGISTRY NAME: buildCoilDecayOscillator
 * Mandatory entry point for Kinetic build.
 */
export function buildCoilDecayOscillator(
  signal: PreparedSignal
): CoilDecayOutput {
  const value = signal.value;
  const precision = signal.precision;

  // --- A3 NORMALIZATION ---
  // Signals normalized against 100 base to reach the 0 to 1 physics range
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS LOGIC ---
  // Maintaining raw decimals exactly as specified in original A3 logic
  const decay = (1 - norm) * precision;
  const health = norm * precision;
  
  // Divergence logic: represents the delta between decay and weighted health
  const divergence = Math.max(0, decay - health * 0.5);

  return {
    field: [
      {
        decay,      // Raw 0-1
        health,     // Raw 0-1
        divergence, // Raw 0-1
        precision   // Raw 0-1
      }
    ]
  };
}

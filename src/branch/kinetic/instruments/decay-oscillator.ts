// src/branch/kinetic/instruments/decay-oscillator.ts
// Physics: Absorption Decay Field (A3)
// Registry: DecayField
// RAW PHYSICS: NO SCALING.

import { PreparedSignal } from '../../../core/engine/signal';

/** * REGISTRY NAME: DecayEvent
 * Verified Source of Truth 
 */
export interface DecayEvent {
  intensity: number;   // Raw Physics: 0 → 1
  decay: number;       // Raw Physics: 0 → 1
  age: number;         // Time in ms
  precision: number;   // Raw Physics: 0 → 1
  timestamp: number;
}

export interface DecayFieldOutput {
  events: DecayEvent[];
}

/** * REGISTRY NAME: buildDecayField
 * Mandatory entry point for Kinetic build.
 */
export function buildDecayField(
  signal: PreparedSignal,
  previousEvents: DecayEvent[] = []
): DecayFieldOutput {
  const value = signal.value;
  const precision = signal.precision;
  const now = signal.timestamp;

  // --- A3 NORMALIZATION ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  // --- CORE PHYSICS: NEW EVENT ---
  // Intensity and Decay start as raw 0-1 values
  const newEvent: DecayEvent = {
    intensity: norm * precision, 
    decay: norm * precision,
    age: 0,
    precision,
    timestamp: now
  };

  // 5000ms Tau (Time Constant) for exponential decay
  const tau = 5000;

  const updatedEvents = previousEvents
    .map((event) => {
      const age = now - event.timestamp;
      // Exponential decay calculation using the raw intensity
      const decay = event.intensity * Math.exp(-age / tau);

      return {
        ...event,
        decay,
        age
      };
    })
    // Filter out events that have decayed below the 1% threshold
    .filter((event) => event.decay > 0.01); 

  return {
    events: [newEvent, ...updatedEvents]
  };
}

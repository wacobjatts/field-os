// src/branch/kinetic/instruments/decay-oscillator.ts
// Decay Oscillator

import { PreparedSignal } from '../../../core/engine/signal';

export interface DecayEvent {
  intensity: number;   // 0 → 100
  decay: number;       // 0 → 100
  age: number;         // ms
  precision: number;   // 0 → 1
  timestamp: number;
}

export interface DecayFieldOutput {
  events: DecayEvent[];
}

export function buildDecayField(
  signal: PreparedSignal,
  previousEvents: DecayEvent[] = []
): DecayFieldOutput {
  const value = signal.value;
  const precision = signal.precision;
  const now = signal.timestamp;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const newEvent: DecayEvent = {
    intensity: norm * precision * 100,
    decay: norm * precision * 100,
    age: 0,
    precision,
    timestamp: now
  };

  const tau = 5000;

  const updatedEvents = previousEvents
    .map((event) => {
      const age = now - event.timestamp;
      const decay = event.intensity * Math.exp(-age / tau);

      return {
        ...event,
        decay,
        age
      };
    })
    .filter((event) => event.decay > 1);

  return {
    events: [newEvent, ...updatedEvents]
  };
}

// instruments/decayoscillator.ts
// Absorption Decay Field (A9)

import { PreparedSignal } from '../../../core/engine/signal';

export interface DecayEvent {
  intensity: number;   // initial event strength
  decay: number;       // current decay level
  age: number;         // time since event
  precision: number;
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

  // --- NEW EVENT ---
  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));
  const newEvent: DecayEvent = {
    intensity: norm * precision,
    decay: norm * precision,
    age: 0,
    precision
  };

  // --- DECAY CONSTANT ---
  const tau = 5000; // ms (tunable)

  const updatedEvents = previousEvents
    .map(event => {
      const age = now - (event.age || now);
      const decay = event.intensity * Math.exp(-age / tau);

      return {
        ...event,
        decay,
        age
      };
    })
    .filter(event => event.decay > 0.01); // remove dead events

  return {
    events: [newEvent, ...updatedEvents]
  };
}
// instruments/kinetic-anchor.ts
// Kinetic Anchor

import { PreparedSignal } from '../../../core/engine/signal';

export interface KineticAnchorPoint {
  anchorStrength: number;  // 0 → 100
  persistence: number;     // 0 → 100
  significance: number;    // 0 → 100
  precision: number;       // 0 → 1
}

export interface KineticAnchorOutput {
  field: KineticAnchorPoint[];
}

export function buildKineticAnchor(
  signal: PreparedSignal
): KineticAnchorOutput {
  const value = signal.value;
  const precision = signal.precision;

  const norm = Math.max(0, Math.min(1, Math.abs(value) / 100));

  const anchorStrength = norm * precision;
  const persistence = Math.min(1, 0.4 + anchorStrength * 0.6);
  const significance = anchorStrength * precision;

  return {
    field: [
      {
        anchorStrength: anchorStrength * 100,
        persistence: persistence * 100,
        significance: significance * 100,
        precision
      }
    ]
  };
}

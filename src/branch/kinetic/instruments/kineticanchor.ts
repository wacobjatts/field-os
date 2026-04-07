// instruments/kineticanchor.ts
// Kinetic Anchor

import { PreparedSignal } from '../../../core/engine/signal';

export interface KineticAnchorPoint {
  anchorStrength: number;  // structural pressure origin strength
  persistence: number;     // how much the anchor holds
  significance: number;    // usefulness of the anchor
  precision: number;
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

  const point: KineticAnchorPoint = {
    anchorStrength,
    persistence,
    significance,
    precision
  };

  return {
    field: [point]
  };
}
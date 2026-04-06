import { calculateAbsorptionPrecision } from './precision/absorptionprecision';
import { calculateMismatchPrecision } from './precision/mismatchprecision';
import { KineticSnapshot } from './types';

export function calculateDecayOscillator(
  snapshot: KineticSnapshot
): {
  absorption: number;
  mismatch: number;
} {
  return {
    absorption: calculateAbsorptionPrecision(snapshot),
    mismatch: calculateMismatchPrecision(snapshot.trades),
  };
}
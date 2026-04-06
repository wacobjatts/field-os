import { calculateTensionPrecision } from './precision/tensionprecision';
import { calculateMismatchPrecision } from './precision/mismatchprecision';
import { calculateAbsorptionPrecision } from './precision/absorptionprecision';
import { KineticSnapshot } from './types';

export function calculateTensionPoints(snapshot: KineticSnapshot): number {
  const mismatch = calculateMismatchPrecision(snapshot.trades);
  const absorption = calculateAbsorptionPrecision(snapshot);

  return calculateTensionPrecision(mismatch, absorption);
}
import { calculateAbsorptionPrecision } from './precision/absorptionprecision';
import { calculateMismatchPrecision } from './precision/mismatchprecision';
import { calculateTensionPrecision } from './precision/tensionprecision';
import { KineticSnapshot } from './types';

export function calculateCompressionSpark(snapshot: KineticSnapshot): number {
  const mismatch = calculateMismatchPrecision(snapshot.trades);
  const absorption = calculateAbsorptionPrecision(snapshot);

  return calculateTensionPrecision(mismatch, absorption);
}
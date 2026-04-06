import { calculateMismatchPrecision } from './precision/mismatchprecision';
import { KineticSnapshot } from './types';

export function calculateTransmission(snapshot: KineticSnapshot): number {
  return calculateMismatchPrecision(snapshot.trades);
}
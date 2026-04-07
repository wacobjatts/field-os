import { calculateAbsorptionPrecision } from './precision/absorptionprecision';
import { KineticSnapshot } from './types';

export function calculateAbsorptionField(snapshot: KineticSnapshot): number {
  return calculateAbsorptionPrecision(snapshot);
}

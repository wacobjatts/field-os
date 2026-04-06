/**
 * ABSORPTION FIELD
 *
 * MATH MAPPING ONLY
 *
 * Maps directly to absorption precision.
 * No additional logic.
 */

import { calculateAbsorptionPrecision } from '../precision/absorptionprecision';
import { KineticSnapshot } from '../types';

export function calculateAbsorptionField(
  snapshot: KineticSnapshot
): number {
  return calculateAbsorptionPrecision(snapshot);
}
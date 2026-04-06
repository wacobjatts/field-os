/**
 * TRANSMISSION
 *
 * MATH MAPPING ONLY
 *
 * Maps directly to mismatch precision.
 * No additional logic.
 */

import { calculateMismatchPrecision } from '../precision/mismatchprecision';
import { Trades } from '../types';

export function calculateTransmission(
  trades: Trades
): number {
  return calculateMismatchPrecision(trades);
}
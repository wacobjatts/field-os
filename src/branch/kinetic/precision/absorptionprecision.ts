/**
 * src/branch/kinetic/precision/absorptionprecision.ts
 *
 * KINETIC PRECISION (3): ABSORPTION
 * Derives the reliability of the absorption observation.
 *
 * Neutrality rules:
 * - no arbitrary confidence boosts
 * - no directional assumptions
 * - only current-slice sample density + synchronization integrity
 */

import { KineticSnapshot } from '../types';

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateAbsorptionPrecision(
  snapshot: KineticSnapshot
): number {
  const { trades, book, timestamp } = snapshot;

  // 1. INTEGRITY GUARD: If the structure is broken or out of sync, precision is floor.
  if (!book.isSynced || book.bestBidSize <= 0 || book.bestAskSize <= 0) {
    return MIN_BRANCH_PRECISION;
  }

  // 2. SAMPLE SIGNIFICANCE: Linear ramp to 10 trades.
  // Prevents high-conviction updates on sparse noise.
  const sampleSignificance = clamp01(trades.tradeCount / 10);

  // 3. TEMPORAL HONESTY: Exponential decay based on data age.
  const bookAgeMs = Math.abs(timestamp - book.localUpdateTime);
  const temporalHonesty = Math.exp(-bookAgeMs / 100);

  const precision = sampleSignificance * temporalHonesty;

  // 4. BOUNDARY SAFETY: Ensure we stay within [MIN, 1.0]
  return Math.max(MIN_BRANCH_PRECISION, clamp01(precision));
}
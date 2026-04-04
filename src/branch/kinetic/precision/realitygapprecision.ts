/**
 * src/branch/kinetic/precision/realitygapprecision.ts
 *
 * KINETIC PRECISION (16): REALITY GAP
 * Measures the reliability of the observed structural gap.
 *
 * Neutrality rules:
 * - no directional bias
 * - no historical narrative
 * - only current data continuity + temporal integrity
 */

import { OrderBookSnapshot } from '../types';

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateRealityGapPrecision(
  book: OrderBookSnapshot,
  timestamp: number
): number {
  // 1. INTEGRITY GUARD
  if (!book.isSynced || book.bestBid <= 0 || book.bestAsk <= 0) {
    return MIN_BRANCH_PRECISION;
  }

  // 2. TEMPORAL HONESTY
  const bookAgeMs = Math.abs(timestamp - book.localUpdateTime);
  const temporalHonesty = Math.exp(-bookAgeMs / 50);

  // 3. CONTINUITY CONFIDENCE
  const syncConfidence = book.isSynced ? 1.0 : 0.1;

  const precision = temporalHonesty * syncConfidence;

  return Math.max(MIN_BRANCH_PRECISION, clamp01(precision));
}
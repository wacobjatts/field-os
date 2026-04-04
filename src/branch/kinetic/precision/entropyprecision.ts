/**
 * src/branch/kinetic/precision/entropyprecision.ts
 *
 * KINETIC PRECISION (30): SYSTEM ENTROPY
 * Measures the reliability of the observed disorder.
 *
 * Neutrality rules:
 * - no arbitrary confidence boosts
 * - no directional bias
 * - strictly derived from data synchronization and sample density
 */

import { KineticSnapshot } from '../types';

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateEntropyPrecision(
  snapshot: KineticSnapshot
): number {
  const { book, trades, timestamp } = snapshot;

  // 1. DATA INTEGRITY
  if (!book.isSynced) {
    return MIN_BRANCH_PRECISION;
  }

  // 2. SAMPLE SIGNIFICANCE
  const sampleSignificance = clamp01(trades.tradeCount / 8);

  // 3. TEMPORAL HONESTY
  const bookAgeMs = Math.abs(timestamp - book.localUpdateTime);
  const temporalHonesty = Math.exp(-bookAgeMs / 125);

  // 4. COMBINED TRUST
  const precision = (sampleSignificance + temporalHonesty) / 2;

  return Math.max(MIN_BRANCH_PRECISION, clamp01(precision));
}
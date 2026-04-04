/**
 * src/branch/kinetic/precision/liarindexprecision.ts
 *
 * KINETIC PRECISION (21): LIAR INDEX
 * Derives reliability from the honesty of the reality gap and the presence
 * of enough activity to make the ratio meaningful.
 *
 * Neutrality rules:
 * - no arbitrary confidence boosts
 * - no directional bias
 * - strictly derived from input integrity and present-slice activity
 */

import { TradeBufferState } from '../types';

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateLiarIndexPrecision(
  gapPrecision: number,
  trades: TradeBufferState
): number {
  const basePrecision = clamp01(gapPrecision);

  // If there is no meaningful activity, the ratio may be mathematically valid
  // but physically unimportant.
  const activityFactor = clamp01(trades.tradeCount / 5);

  const precision = basePrecision * activityFactor;

  return Math.max(MIN_BRANCH_PRECISION, clamp01(precision));
}
/**
 * src/branch/kinetic/precision/mismatchprecision.ts
 *
 * KINETIC PRECISION (17): FORCE MISMATCH
 * Measures the reliability of the observed force imbalance.
 *
 * Neutrality rules:
 * - no directional bias
 * - no historical assumptions
 * - based only on current-slice sample density and dispersion
 */

import { TradeBufferState } from '../types';

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateMismatchPrecision(
  trades: TradeBufferState
): number {
  const totalWork = trades.buyWork + trades.sellWork;

  // 1. INTEGRITY GUARD: If no motion, there is no evidence to weigh.
  if (trades.tradeCount <= 0 || totalWork <= 0) {
    return MIN_BRANCH_PRECISION;
  }

  // 2. SAMPLE SIGNIFICANCE: Linear confidence ramp to 10 trades.
  const sampleSignificance = clamp01(trades.tradeCount / 10);

  // 3. DISPERSION (Stability Factor):
  // High micro-volatility within the slice reduces structural trust.
  const stabilityFactor = 1 / (1 + Math.max(0, trades.volatility));

  const precision = sampleSignificance * stabilityFactor;

  // 4. BOUNDARY SAFETY: Ensure we return an honest [MIN, 1.0] weight.
  return Math.max(MIN_BRANCH_PRECISION, clamp01(precision));
}
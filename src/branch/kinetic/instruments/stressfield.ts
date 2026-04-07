/**
 * KINETIC MEASUREMENT INSTRUMENT
 * TYPE: Mismatch (Force Imbalance)
 * DOMAIN: Structural Physics
 * * Measures the directional force imbalance between buy work and sell work.
 * Returns a signed unit value where:
 * +1.0 = Pure Buy Force
 * -1.0 = Pure Sell Force
 * 0.0 = Perfect Equilibrium
 */

export interface MismatchInput {
  buyWork: number;
  sellWork: number;
}

/**
 * Pure mathematical helper to bound values between -1 and 1.
 * Localized to ensure instrument is self-contained.
 */
function clampSignedUnit(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

/**
 * RAW MISMATCH MEASUREMENT
 * Extracted from src/branch/kinetic/mismatch.ts
 * * Formula: (BuyWork - SellWork) / (BuyWork + SellWork)
 */
export function measureMismatch(trades: MismatchInput): number {
  // 1. Safety Guard: Check for non-finite inputs
  if (!Number.isFinite(trades.buyWork) || !Number.isFinite(trades.sellWork)) {
    return 0;
  }

  const { buyWork, sellWork } = trades;
  const totalWork = buyWork + sellWork;

  // 2. Integrity Guard: If no motion, there is no mismatch
  if (totalWork <= 0) {
    return 0;
  }

  // 3. Calculate raw imbalance
  const mismatch = (buyWork - sellWork) / totalWork;

  // 4. Return clamped result [-1, 1]
  return clampSignedUnit(mismatch);
}


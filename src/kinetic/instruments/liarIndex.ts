/**
 * KINETIC MEASUREMENT INSTRUMENT
 * TYPE: Liar Index (Positional Authenticity)
 * DOMAIN: Structural Physics
 * * Measures the "honesty" of a price move by calculating the ratio 
 * of the structural Reality Gap to the observed Price Displacement.
 * A high index suggests the price is "lying" (straying far from its anchor 
 * without corresponding displacement).
 */

/**
 * Pure mathematical helper to bound values between 0 and 1.
 * Localized to ensure instrument is self-contained.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * RAW LIAR INDEX MEASUREMENT
 * Extracted from src/branch/kinetic/liarindex.ts
 * * Logic: gap / move
 * * Returns: A clamped [0, 1] value representing positional divergence.
 */
export function measureLiarIndex(
  realityGap: number,
  displacement: number
): number {
  // 1. Safety Guard: Check for non-finite inputs
  if (!Number.isFinite(realityGap) || !Number.isFinite(displacement)) {
    return 0;
  }

  // 2. Normalize inputs to ensure non-negative physics
  const gap = Math.max(0, realityGap);
  const move = Math.max(0, displacement);

  // 3. Integrity Guard: Prevent division by zero if there is no movement
  if (move <= 0) {
    return 0;
  }

  // 4. Calculate the Ratio
  const liarIndex = gap / move;

  // 5. Return clamped result [0, 1]
  return clamp01(liarIndex);
}


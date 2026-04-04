/**
 * src/branch/kinetic/normalization/normalize.ts
 *
 * Branch-local normalization utilities.
 * These functions prepare raw Kinetic outputs for clean trunk input
 * without changing the underlying calculator logic.
 */

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Converts a raw price-distance gap into a unitless structural coefficient.
 *
 * Logic:
 * - rawGap stays physically honest in the calculator
 * - normalization happens here, explicitly
 * - uses current mid-price so scaling adapts to the asset's live regime
 *
 * Example:
 *   BTC gap of 50 on mid 50,000 = 0.001
 *   BTC gap of 500 on mid 50,000 = 0.01
 */
export function normalizeRealityGap(
  rawGap: number,
  midPrice: number
): number {
  const gap = Math.max(0, rawGap);
  const mid = Math.max(0, midPrice);

  if (!Number.isFinite(gap) || !Number.isFinite(mid) || mid <= 0) {
    return 0;
  }

  const relativeGap = gap / mid;

  // Scale into a usable [0,1] trunk-friendly range.
  // This keeps tiny micro-gaps from vanishing, while still bounding extremes.
  const scaledGap = relativeGap * 100;

  return clamp01(scaledGap);
}
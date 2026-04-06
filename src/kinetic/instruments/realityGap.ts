/**
 * KINETIC MEASUREMENT INSTRUMENT
 * TYPE: Reality Gap (Structural Distance)
 * DOMAIN: Structural Physics
 * * Measures the absolute distance between the current market mid-price 
 * and a defined structural anchor (e.g., a volume-weighted base or historical anchor).
 */

export interface RealityGapBookState {
  bestBid: number;
  bestAsk: number;
}

export interface RealityGapInput {
  book: RealityGapBookState;
}

/**
 * RAW REALITY GAP MEASUREMENT
 * Extracted from src/branch/kinetic/realitygap.ts
 * * Logic: Absolute difference between current Mid and Anchor Mid.
 */
export function measureRealityGap(
  input: RealityGapInput,
  anchorMid: number
): number {
  const { book } = input;

  // 1. Calculate current midpoint
  const currentMid = (book.bestBid + book.bestAsk) / 2;

  // 2. Safety Guard: Check for non-finite inputs
  if (!Number.isFinite(currentMid) || !Number.isFinite(anchorMid)) {
    return 0;
  }

  // 3. Calculate Absolute Gap
  // Ensure the result is non-negative as per source logic.
  return Math.max(0, Math.abs(currentMid - anchorMid));
}


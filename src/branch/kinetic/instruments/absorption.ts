/**
 * KINETIC MEASUREMENT INSTRUMENT
 * TYPE: Absorption (Price/Work Efficiency)
 * DOMAIN: Structural Physics
 * * Measures the efficiency of price displacement relative to the "Total Work" 
 * (volume) and the density of the liquidity frontier.
 */

export interface OrderBookState {
  bestBid: number;
  bestBidSize: number;
  bestAsk: number;
  bestAskSize: number;
}

export interface TradeBufferState {
  buyWork: number;
  sellWork: number;
}

export interface AbsorptionSnapshot {
  book: OrderBookState;
  trades: TradeBufferState;
}

/**
 * Pure mathematical helper to bound values between 0 and 1.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * RAW ABSORPTION MEASUREMENT
 * Extracted from src/branch/kinetic/absorption.ts
 * * Formula: 1 - (SlippageCost / (TotalWork + SlippageCost))
 * Where SlippageCost = Price Displacement * Average Frontier Density
 */
export function measureAbsorption(
  snapshot: AbsorptionSnapshot,
  previousMid: number
): number {
  const { trades, book } = snapshot;

  // 1. Calculate current midpoint
  const currentMid = (book.bestBid + book.bestAsk) / 2;
  
  // 2. Calculate Price Displacement (Distance moved)
  const displacement = Math.abs(currentMid - previousMid);
  
  // 3. Calculate Total Work (Cumulative Volume Force)
  const totalWork = trades.buyWork + trades.sellWork;

  if (totalWork <= 0) return 0;

  // 4. Calculate Frontier Density (Liquidity "Thickness" at the edge)
  const frontierDensity =
    ((book.bestBid * book.bestBidSize) + (book.bestAsk * book.bestAskSize)) / 2;

  if (!Number.isFinite(frontierDensity) || frontierDensity <= 0) return 0;

  // 5. Calculate Slippage Cost (Theoretical cost to move price by 'displacement')
  const slippageCost = displacement * frontierDensity;
  
  // 6. Calculate Absorption (The inverse of efficiency)
  // Higher absorption means more work was required for less movement.
  const absorption = 1 - (slippageCost / (totalWork + slippageCost));

  return clamp01(absorption);
}

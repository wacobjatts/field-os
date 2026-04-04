import { KineticSnapshot } from '../types';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateAbsorption(
  snapshot: KineticSnapshot,
  previousMid: number
): number {
  const { trades, book } = snapshot;

  const currentMid = (book.bestBid + book.bestAsk) / 2;
  const displacement = Math.abs(currentMid - previousMid);
  const totalWork = trades.buyWork + trades.sellWork;

  if (totalWork <= 0) return 0;

  const frontierDensity =
    ((book.bestBid * book.bestBidSize) + (book.bestAsk * book.bestAskSize)) / 2;

  if (!Number.isFinite(frontierDensity) || frontierDensity <= 0) return 0;

  const slippageCost = displacement * frontierDensity;
  const absorption = 1 - (slippageCost / (totalWork + slippageCost));

  return clamp01(absorption);
}
import { KineticSnapshot } from '../types';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateEntropy(snapshot: KineticSnapshot): number {
  const { book, trades, timestamp } = snapshot;

  const mid = (book.bestBid + book.bestAsk) / 2;
  const spread = Math.max(0, book.bestAsk - book.bestBid);
  const relativeSpread = mid > 0 ? spread / mid : 0;

  const normalizedSpread = clamp01(relativeSpread * 1000);
  const normalizedVolatility = clamp01(Math.max(0, trades.volatility));
  const bookAgeMs = Math.abs(timestamp - book.localUpdateTime);
  const syncDegradation = clamp01(bookAgeMs / 250);

  const entropy =
    (normalizedSpread + normalizedVolatility + syncDegradation) / 3;

  return clamp01(entropy);
}
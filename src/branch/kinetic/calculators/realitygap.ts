import { KineticSnapshot } from '../types';

export function calculateRealityGap(
  snapshot: KineticSnapshot,
  anchorMid: number
): number {
  const { book } = snapshot;

  const currentMid = (book.bestBid + book.bestAsk) / 2;

  if (!Number.isFinite(currentMid) || !Number.isFinite(anchorMid)) {
    return 0;
  }

  return Math.max(0, Math.abs(currentMid - anchorMid));
}
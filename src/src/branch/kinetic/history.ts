/**
 * src/branch/kinetic/history.ts
 *
 * Branch-local helpers for tracking previous and anchor mids between slices.
 * This is intentionally simple and non-assumptive.
 */

import { KineticSnapshot } from './types';

export interface KineticHistoryState {
  previousMid: number;
  anchorMid: number;
  lastTimestamp: number;
}

export function getMidPrice(snapshot: KineticSnapshot): number {
  return (snapshot.book.bestBid + snapshot.book.bestAsk) / 2;
}

export function createInitialHistory(
  initialMid: number,
  timestamp: number
): KineticHistoryState {
  return {
    previousMid: initialMid,
    anchorMid: initialMid,
    lastTimestamp: timestamp
  };
}

/**
 * Advances history after a slice is processed.
 *
 * `reanchor` is explicit on purpose.
 * We do NOT hide anchor logic in here.
 */
export function advanceHistory(
  snapshot: KineticSnapshot,
  history: KineticHistoryState,
  reanchor: boolean = false
): KineticHistoryState {
  const currentMid = getMidPrice(snapshot);

  return {
    previousMid: currentMid,
    anchorMid: reanchor ? currentMid : history.anchorMid,
    lastTimestamp: snapshot.timestamp
  };
}
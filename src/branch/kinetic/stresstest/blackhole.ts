/**
 * src/branch/kinetic/stresstest/blackhole.ts
 *
 * BLACK HOLE TEST
 * Simulates strong buy-side work being absorbed at the frontier
 * with minimal displacement.
 */

import { KineticSnapshot } from '../types';

export function createBlackHoleSnapshot(): {
  snapshot: KineticSnapshot;
  previousMid: number;
  anchorMid: number;
} {
  const previousMid = 100;
  const currentBid = 99.99;
  const currentAsk = 100.01;
  const now = Date.now();

  const snapshot: KineticSnapshot = {
    timestamp: now,
    book: {
      bids: [
        { price: 99.99, size: 1200 },
        { price: 99.98, size: 900 },
        { price: 99.97, size: 700 }
      ],
      asks: [
        { price: 100.01, size: 1250 },
        { price: 100.02, size: 950 },
        { price: 100.03, size: 720 }
      ],
      bestBid: currentBid,
      bestAsk: currentAsk,
      bestBidSize: 1200,
      bestAskSize: 1250,
      lastUpdateId: 1,
      lastServerTime: now,
      localUpdateTime: now,
      isSynced: true
    },
    trades: {
      trades: [
        { price: 100.01, size: 40, side: 'buy', timestamp: now - 10, isLiquidation: false },
        { price: 100.01, size: 38, side: 'buy', timestamp: now - 8, isLiquidation: false },
        { price: 100.01, size: 42, side: 'buy', timestamp: now - 6, isLiquidation: false },
        { price: 100.01, size: 39, side: 'buy', timestamp: now - 4, isLiquidation: false },
        { price: 100.01, size: 41, side: 'buy', timestamp: now - 2, isLiquidation: false }
      ],
      buyWork: 20050,
      sellWork: 500,
      totalBuyVolume: 200,
      totalSellVolume: 5,
      tradeCount: 5,
      vwap: 100.01,
      volatility: 0.02
    }
  };

  return {
    snapshot,
    previousMid,
    anchorMid: previousMid
  };
}
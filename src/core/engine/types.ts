/**
 * PATH: src/core/engine/types.ts
 * PURPOSE: The "Genome" of FieldOS.
 * Defines the atomic structures for Order Books, Trades, and System Health.
 */

export interface BookLevel {
  price: number;
  size: number;
}

export interface OrderBookState {
  // Map keyed by price for O(1) updates during L2 WebSocket diffs
  bids: Map<number, number>;
  asks: Map<number, number>;
  bestBid: number;
  bestAsk: number;
  lastUpdateId: number;
  // Tracking time for Entropy and Validity Decay calculations
  lastServerTime: number;
  localUpdateTime: number;
  isSynced: boolean;
}

export interface TradePrint {
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
  isLiquidation: boolean;
}

export interface TradeBufferState {
  trades: TradePrint[];
  // Aggregated Work (W = P * Q) for the current loop cycle
  buyWork: number;
  sellWork: number;
  // Cumulative totals for normalization/learning
  totalBuyVolume: number;
  totalSellVolume: number;
  tradeCount: number;
  vwap: number;
}

/**
 * The unified snapshot passed to the Physics Engine every heartbeat.
 */
export interface SystemSnapshot {
  book: OrderBookState;
  trades: TradeBufferState;
  timestamp: number;
}
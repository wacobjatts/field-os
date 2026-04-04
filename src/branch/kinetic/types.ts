/**
 * src/branch/kinetic/types.ts
 *
 * Branch-local market data structures for Kinetic.
 * These do NOT belong in FieldOS core.
 */

export interface BookLevel {
  price: number;
  size: number;
}

export interface OrderBookSnapshot {
  bids: BookLevel[];
  asks: BookLevel[];
  bestBid: number;
  bestAsk: number;
  bestBidSize: number;
  bestAskSize: number;
  lastUpdateId: number;
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
  buyWork: number;
  sellWork: number;
  totalBuyVolume: number;
  totalSellVolume: number;
  tradeCount: number;
  vwap: number;
  volatility: number;
}

export interface KineticSnapshot {
  book: OrderBookSnapshot;
  trades: TradeBufferState;
  timestamp: number;
}
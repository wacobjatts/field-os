import WebSocket from 'ws';
import { KineticSnapshot, OrderBookSnapshot, TradeBufferState, TradePrint } from '../branch/kinetic/types';

const STREAM_URL =
  'wss://stream.binance.com:9443/stream?streams=btcusdt@aggTrade/btcusdt@depth@100ms';

const MAX_TRADES = 200;

export interface BinanceKineticFeedHandle {
  stop: () => void;
}

export interface BinanceKineticFeedOptions {
  onSnapshot: (snapshot: KineticSnapshot) => void;
  reconnectDelayMs?: number;
}

function calculateVwap(trades: TradePrint[]): number {
  let totalVolume = 0;
  let totalWork = 0;

  for (const trade of trades) {
    totalVolume += trade.size;
    totalWork += trade.price * trade.size;
  }

  if (totalVolume <= 0) return 0;
  return totalWork / totalVolume;
}

function calculateVolatility(trades: TradePrint[]): number {
  if (trades.length < 2) return 0;

  const prices = trades.map((t) => t.price);
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  if (mean === 0) return 0;

  const variance =
    prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;

  const stdDev = Math.sqrt(variance);

  return stdDev / mean;
}

function buildTradeBufferState(trades: TradePrint[]): TradeBufferState {
  let buyWork = 0;
  let sellWork = 0;
  let totalBuyVolume = 0;
  let totalSellVolume = 0;

  for (const trade of trades) {
    const work = trade.price * trade.size;

    if (trade.side === 'buy') {
      buyWork += work;
      totalBuyVolume += trade.size;
    } else {
      sellWork += work;
      totalSellVolume += trade.size;
    }
  }

  return {
    trades,
    buyWork,
    sellWork,
    totalBuyVolume,
    totalSellVolume,
    tradeCount: trades.length,
    vwap: calculateVwap(trades),
    volatility: calculateVolatility(trades)
  };
}

export function startBinanceKineticFeed(
  options: BinanceKineticFeedOptions
): BinanceKineticFeedHandle {
  const reconnectDelayMs = options.reconnectDelayMs ?? 3000;

  let socket: WebSocket | null = null;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let stopped = false;

  let bestBid = 0;
  let bestAsk = 0;
  let bestBidSize = 0;
  let bestAskSize = 0;
  let lastUpdateId = 0;
  let lastServerTime = 0;
  let localUpdateTime = 0;
  let isSynced = false;

  let bids: { price: number; size: number }[] = [];
  let asks: { price: number; size: number }[] = [];

  let trades: TradePrint[] = [];

  function emitSnapshot(): void {
    if (bestBid <= 0 || bestAsk <= 0) return;

    const book: OrderBookSnapshot = {
      bids,
      asks,
      bestBid,
      bestAsk,
      bestBidSize,
      bestAskSize,
      lastUpdateId,
      lastServerTime,
      localUpdateTime,
      isSynced
    };

    const tradeState = buildTradeBufferState(trades);

    const snapshot: KineticSnapshot = {
      book,
      trades: tradeState,
      timestamp: Date.now()
    };

    options.onSnapshot(snapshot);
  }

  function connect(): void {
    if (stopped) return;

    console.log(`[binance-feed] connecting → ${STREAM_URL}`);
    socket = new WebSocket(STREAM_URL);

    socket.on('open', () => {
      console.log('[binance-feed] connected');
    });

    socket.on('message', (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        const stream = parsed.stream;
        const data = parsed.data;

        if (stream.includes('@aggTrade')) {
          const price = Number(data.p);
          const size = Number(data.q);
          const timestamp = Number(data.T);
          const isBuyerMaker = Boolean(data.m);

          const trade: TradePrint = {
            price,
            size,
            side: isBuyerMaker ? 'sell' : 'buy',
            timestamp,
            isLiquidation: false
          };

          trades.push(trade);

          if (trades.length > MAX_TRADES) {
            trades = trades.slice(-MAX_TRADES);
          }

          emitSnapshot();
          return;
        }

        if (stream.includes('@depth')) {
          const bidUpdates = Array.isArray(data.b) ? data.b : [];
          const askUpdates = Array.isArray(data.a) ? data.a : [];

          bids = bidUpdates.map((entry: [string, string]) => ({
            price: Number(entry[0]),
            size: Number(entry[1])
          }));

          asks = askUpdates.map((entry: [string, string]) => ({
            price: Number(entry[0]),
            size: Number(entry[1])
          }));

          if (bids.length > 0) {
            bestBid = bids[0].price;
            bestBidSize = bids[0].size;
          }

          if (asks.length > 0) {
            bestAsk = asks[0].price;
            bestAskSize = asks[0].size;
          }

          lastUpdateId = Number(data.u ?? lastUpdateId + 1);
          lastServerTime = Date.now();
          localUpdateTime = Date.now();
          isSynced = bestBid > 0 && bestAsk > 0;

          emitSnapshot();
        }
      } catch (error) {
        console.error('[binance-feed] parse error:', error);
      }
    });

    socket.on('close', () => {
      console.log('[binance-feed] disconnected');

      if (!stopped) {
        reconnectTimer = setTimeout(connect, reconnectDelayMs);
      }
    });

    socket.on('error', (error) => {
      console.error('[binance-feed] error:', error);
    });
  }

  connect();

  return {
    stop: () => {
      stopped = true;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (socket) {
        socket.close();
      }

      console.log('[binance-feed] stopped');
    }
  };
}
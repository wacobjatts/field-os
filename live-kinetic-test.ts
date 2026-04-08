import WebSocket from 'ws';
// Note: using .js extension for ESM compatibility with ts-node
import { computeKinetics } from './src/branch/kinetic/computekinetics.js';

const ws = new WebSocket('wss://advanced-trade-ws.coinbase.com');

let lastMid: number | null = null;
let anchorMid: number | null = null;

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    product_ids: ['BTC-USD'],
    channel: 'market_trades',
  }));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());

    if (message.channel === 'market_trades' && message.events?.[0]?.trades?.[0]) {
      const trade = message.events[0].trades[0];
      const price = parseFloat(trade.price);
      const quantity = parseFloat(trade.size);
      const timestamp = new Date(trade.time).getTime();

      if (!anchorMid) anchorMid = price;
      
      const snapshot = {
        book: { bestBid: price - 0.01, bestAsk: price + 0.01 },
        trades: [{ price, quantity, timestamp }],
        timestamp
      };

      const result = computeKinetics({
        snapshot,
        previousMid: lastMid ?? price,
        anchorMid: anchorMid,
        source: 'coinbase'
      });

      console.log('--- TICK SUCCESS ---');
      console.log('PRICE:', price);

      // result is the output from your engine/orchestrator
      if (Array.isArray(result)) {
        result.forEach((sig: any) => {
          console.log('RAW:', sig.originalSignal);
          console.log('PRECISION:', sig.effectivePrecision);
        });
      }

      lastMid = price;
      
      // Exit after first successful print to verify setup
      ws.close();
      process.exit(0);
    }
  } catch (err) {
    console.error('Runtime Error:', err);
    process.exit(1);
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
  process.exit(1);
});

import { KineticBridge } from './modules/kineticbridge';
import { initializeRecorder, recordSlice } from './branch/kinetic/recorder';
import { startBinanceKineticFeed } from './modules/binancekineticfeed';

const bridge = new KineticBridge();

let previousMid = 0;
let anchorMid = 0;

const OUTPUT_PATH = 'data/kinetic-live-binance.jsonl';

initializeRecorder(OUTPUT_PATH);

console.log('Kinetic live system + recorder started...\n');

const handle = startBinanceKineticFeed({
  onSnapshot: (snapshot) => {
    const currentMid = (snapshot.book.bestBid + snapshot.book.bestAsk) / 2;

    if (previousMid === 0) {
      previousMid = currentMid;
      anchorMid = currentMid;
    }

    const result = bridge.step({
      snapshot,
      previousMid,
      anchorMid
    });

    previousMid = currentMid;

    recordSlice(
      {
        timestamp: snapshot.timestamp,
        symbol: 'BTCUSDT',
        midPrice: currentMid,
        output: {
          signals: [],
          raw: result.raw,
          precision: result.precision
        }
      },
      {
        filePath: OUTPUT_PATH
      }
    );

    console.log('--- LIVE STEP ---');
    console.log('MID:', currentMid.toFixed(4));
    console.log('RAW:', result.raw);
    console.log('PRECISION:', result.precision);
    console.log('RECORDED TO:', OUTPUT_PATH);
    console.log('\n');
  }
});

process.on('SIGINT', () => {
  handle.stop();
  console.log('Kinetic live system stopped.');
  process.exit(0);
});
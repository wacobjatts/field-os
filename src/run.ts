import { initializeRecorder, recordSlice } from './branch/kinetic/recorder';
import { KineticSnapshot } from './branch/kinetic/types';
import { startBinanceKineticFeed } from './modules/binancekineticfeed';
import { KineticBridge } from './modules/kineticbridge';
import { SourceProfile } from './core/engine/signal';

const OUTPUT_PATH = 'data/kinetic-live-binance.jsonl';

const KINETIC_LIVE_SOURCE: SourceProfile = {
  id: 'kinetic-live',
  label: 'Kinetic Live Source',
  kind: 'synthetic',
  credibility: 1,
  sampleCount: 1000,
  trustMode: 'fixed',
  baselineBias: 0,
  reliabilityVariance: 0,
  lastUpdated: Date.now()
};

const bridge = new KineticBridge(KINETIC_LIVE_SOURCE);

let previousMid = 0;
let anchorMid = 0;

initializeRecorder(OUTPUT_PATH);

function handleSnapshot(snapshot: KineticSnapshot): void {
  const currentMid = (snapshot.book.bestBid + snapshot.book.bestAsk) / 2;

  if (!Number.isFinite(currentMid) || currentMid <= 0) {
    return;
  }

  if (anchorMid === 0) {
    anchorMid = currentMid;
  }

  const output = bridge.step({
    snapshot,
    previousMid,
    anchorMid
  });

  console.log(
    `[${output.state.lastAssessment.command}] ` +
      `Tension: ${output.raw.tension.toFixed(4)} | ` +
      `Liar: ${output.raw.liarIndex.toFixed(4)} | ` +
      `Entropy: ${output.raw.entropy.toFixed(4)} | ` +
      `Mid: ${currentMid.toFixed(4)}`
  );

  recordSlice(
    {
      timestamp: Date.now(),
      symbol: 'BTCUSDT',
      midPrice: currentMid,
      output: {
        signals: [],
        raw: output.raw,
        precision: output.precision
      }
    },
    {
      filePath: OUTPUT_PATH
    }
  );

  previousMid = currentMid;
}

console.log('FieldOS live runtime starting...');
console.log(`Recording to: ${OUTPUT_PATH}`);

const feed = startBinanceKineticFeed({
  onSnapshot: (snapshot) => handleSnapshot(snapshot)
});

process.on('SIGINT', () => {
  console.log('\nShutting down FieldOS live runtime...');
  feed.stop();
  console.log('Feed stopped cleanly.');
  process.exit(0);
});
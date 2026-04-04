import { KineticBridge } from './modules/kineticbridge';
import { KineticSnapshot } from './branch/kinetic/types';

// --- FAKE DATA GENERATOR (replace later with real feed) ---
function generateSnapshot(): KineticSnapshot {
  const mid = 100 + (Math.random() - 0.5) * 2;

  return {
    bid: mid - 0.1,
    ask: mid + 0.1,
    mid,
    volume: Math.random() * 1000,
    timestamp: Date.now()
  };
}

// --- MAIN LOOP ---
const bridge = new KineticBridge();

let previousMid = 100;
let anchorMid = 100;

console.log('Kinetic system started...\n');

setInterval(() => {
  const snapshot = generateSnapshot();

  const result = bridge.step({
    snapshot,
    previousMid,
    anchorMid
  });

  previousMid = snapshot.mid;

  console.log('--- STEP ---');
  console.log('MID:', snapshot.mid.toFixed(4));
  console.log('RAW:', result.raw);
  console.log('PRECISION:', result.precision);
  console.log('\n');

}, 2000);
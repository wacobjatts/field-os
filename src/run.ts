limport { KineticBridge } from './modules/kineticbridge';
import { KineticSnapshot } from './branch/kinetic/types';
import { initializeRecorder, recordSlice } from './branch/kinetic/recorder';

/**
 * REALISTIC FAKE DATA (continuous movement)
 */
let currentMid = 100;

function generateSnapshot(): KineticSnapshot {
  const drift = (Math.random() - 0.5) * 0.2;
  currentMid += drift;

  return {
    bid: currentMid - 0.1,
    ask: currentMid + 0.1,
    mid: currentMid,
    volume: 100 + Math.random() * 200,
    timestamp: Date.now()
  };
}

/**
 * ENGINE + BRIDGE
 */
const bridge = new KineticBridge();

let previousMid = 100;
let anchorMid = 100;

/**
 * RECORDER SETUP
 */
const OUTPUT_PATH = 'data/kinetic-live-loop.jsonl';

initializeRecorder(OUTPUT_PATH);

console.log('Kinetic system + recorder started...\n');

/**
 * MAIN LOOP
 */
setInterval(() => {
  const snapshot = generateSnapshot();

  const result = bridge.step({
    snapshot,
    previousMid,
    anchorMid
  });

  previousMid = snapshot.mid;

  /**
   * RECORD DATA (this is the new piece)
   */
  recordSlice(
    {
      timestamp: snapshot.timestamp,
      symbol: 'SIM-LIVE',
      midPrice: snapshot.mid,
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

  /**
   * CONSOLE OUTPUT (same as before)
   */
  console.log('--- STEP ---');
  console.log('MID:', snapshot.mid.toFixed(4));
  console.log('RAW:', result.raw);
  console.log('PRECISION:', result.precision);
  console.log('RECORDED TO:', OUTPUT_PATH);
  console.log('\n');

}, 2000);
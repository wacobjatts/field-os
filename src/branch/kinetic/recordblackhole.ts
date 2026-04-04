/**
 * src/branch/kinetic/recordblackhole.ts
 *
 * Runs the Black Hole stress test through the orchestrator
 * and records the output to a local JSONL file.
 */

import { processSlice } from './orchestrator';
import { createBlackHoleSnapshot } from './stresstest/blackhole';
import { initializeRecorder, recordSlice } from './recorder';
import { SourceProfile } from '../../core/engine/signal';

const OUTPUT_PATH = 'data/kinetic-blackhole.jsonl';

const kineticSource: SourceProfile = {
  id: 'kinetic-sim',
  label: 'Kinetic Simulation Source',
  kind: 'synthetic',
  credibility: 1,
  sampleCount: 1000,
  trustMode: 'fixed',
  baselineBias: 0,
  reliabilityVariance: 0,
  lastUpdated: Date.now()
};

export function recordBlackHoleTest(): void {
  initializeRecorder(OUTPUT_PATH);

  const { snapshot, previousMid, anchorMid } = createBlackHoleSnapshot();

  const result = processSlice({
    snapshot,
    previousMid,
    anchorMid,
    source: kineticSource
  });

  const midPrice = (snapshot.book.bestBid + snapshot.book.bestAsk) / 2;

  recordSlice(
    {
      timestamp: snapshot.timestamp,
      symbol: 'SIM-BLACKHOLE',
      midPrice,
      output: result
    },
    {
      filePath: OUTPUT_PATH
    }
  );

  console.log('Recorded Black Hole test to:', OUTPUT_PATH);
  console.log('RAW:', result.raw);
  console.log('PRECISION:', result.precision);
}
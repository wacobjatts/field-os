/**
 * src/branch/kinetic/looprecorder.ts
 *
 * Continuous recorder loop for the Kinetic branch.
 * Runs the Black Hole test repeatedly and appends output to JSONL.
 */

import { processSlice } from './orchestrator';
import { createBlackHoleSnapshot } from './stresstest/blackhole';
import { initializeRecorder, recordSlice } from './recorder';
import { SourceProfile } from '../../core/engine/signal';

const OUTPUT_PATH = 'data/kinetic-blackhole-loop.jsonl';
const DEFAULT_INTERVAL_MS = 100;

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

export interface LoopRecorderHandle {
  stop: () => void;
}

export function startBlackHoleLoop(
  intervalMs: number = DEFAULT_INTERVAL_MS
): LoopRecorderHandle {
  initializeRecorder(OUTPUT_PATH);

  const timer = setInterval(() => {
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

    console.log(
      `[loop] recorded ${snapshot.timestamp} → ${OUTPUT_PATH}`
    );
  }, intervalMs);

  return {
    stop: () => clearInterval(timer)
  };
}
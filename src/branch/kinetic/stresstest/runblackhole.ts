/**
 * src/branch/kinetic/stresstest/runblackhole.ts
 *
 * Runs the BLACK HOLE stress test through the Kinetic orchestrator
 * and prints the result for inspection.
 */

import { processSlice } from '../orchestrator';
import { createBlackHoleSnapshot } from './blackhole';
import { SourceProfile } from '../../../core/engine/signal';

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

export function runBlackHoleTest() {
  const { snapshot, previousMid, anchorMid } = createBlackHoleSnapshot();

  const result = processSlice({
    snapshot,
    previousMid,
    anchorMid,
    source: kineticSource
  });

  console.log('--- BLACK HOLE TEST ---');
  console.log('RAW:', result.raw);
  console.log('PRECISION:', result.precision);
  console.log('SIGNALS:', result.signals);

  return result;
}
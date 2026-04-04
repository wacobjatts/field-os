import { runKineticThroughTrunk } from './trunkbridge';
import { createBlackHoleSnapshot } from './stresstest/blackhole';
import { SystemState, Tenzo } from '../../core/engine/tenzo';
import { SourceProfile } from '../../core/engine/signal';

const source: SourceProfile = {
  id: 'kinetic-test',
  label: 'Kinetic Test Source',
  kind: 'synthetic',
  credibility: 1,
  sampleCount: 100,
  trustMode: 'fixed',
  baselineBias: 0,
  reliabilityVariance: 0,
  lastUpdated: Date.now()
};

let state: SystemState = Tenzo.initialize({
  sources: [source]
});

const { snapshot, previousMid, anchorMid } = createBlackHoleSnapshot();

state = runKineticThroughTrunk(
  state,
  {
    snapshot,
    previousMid,
    anchorMid,
    source
  },
  source
);

console.log('FINAL STATE:', state);
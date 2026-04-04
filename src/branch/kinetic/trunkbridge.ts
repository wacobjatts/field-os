import { processSlice, KineticOrchestratorInput } from './orchestrator';
import { translateToSignals } from './translator';
import { Tenzo, SystemState } from '../../core/engine/tenzo';
import { SourceProfile } from '../../core/engine/signal';

export function runKineticThroughTrunk(
  state: SystemState,
  input: KineticOrchestratorInput,
  source: SourceProfile
): SystemState {
  const branch = processSlice(input);

  const signals = translateToSignals(
    branch,
    source,
    input.snapshot.timestamp
  );

  return Tenzo.facilitate(state, signals, input.snapshot.timestamp);
}
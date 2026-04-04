import { SourceProfile } from '../../core/engine/signal';
import { SystemState, Tenzo } from '../../core/engine/tenzo';
import { PreparedSignal } from '../../core/types';
import { KineticSnapshot } from './types';
import { processSlice, KineticOrchestratorInput, KineticOrchestratorOutput } from './orchestrator';

export interface TrunkBridgeResult {
  state: SystemState;
  branch: KineticOrchestratorOutput;
}

export function createInitialKineticState(
  source: SourceProfile,
  timestamp: number = Date.now()
): SystemState {
  return Tenzo.initialize({
    sources: [source],
    timestamp
  });
}

function translateToSignals(
  output: KineticOrchestratorOutput,
  source: SourceProfile,
  timestamp: number
): PreparedSignal[] {
  const signalPairs: Array<[keyof KineticOrchestratorOutput['raw'], string]> = [
    ['absorption', 'kinetic.absorption'],
    ['mismatch', 'kinetic.mismatch'],
    ['realityGap', 'kinetic.realityGap'],
    ['normalizedRealityGap', 'kinetic.normalizedRealityGap'],
    ['tension', 'kinetic.tension'],
    ['liarIndex', 'kinetic.liarIndex'],
    ['entropy', 'kinetic.entropy']
  ];

  return signalPairs.map(([rawKey, dimensionId]) => ({
    dimensionId,
    value: output.raw[rawKey],
    observedPrecision:
      output.precision[
        rawKey === 'normalizedRealityGap' ? 'realityGap' : (rawKey as keyof KineticOrchestratorOutput['precision'])
      ] ?? 0,
    sourceId: source.id,
    timestamp
  }));
}

export function runKineticThroughTrunk(
  currentState: SystemState,
  input: KineticOrchestratorInput
): TrunkBridgeResult {
  const timestamp = input.snapshot.timestamp ?? Date.now();

  const branch = processSlice(input);
  const signals = translateToSignals(branch, input.source, timestamp);

  if (!signals.length) {
    return {
      state: currentState,
      branch
    };
  }

  const nextState = Tenzo.facilitate(currentState, signals, timestamp);

  return {
    state: nextState,
    branch
  };
}

/**
 * Optional helper for external runners that want a simple heartbeat.
 */
export function startKineticHeartbeat(
  getInput: () => KineticOrchestratorInput,
  source: SourceProfile,
  onStep?: (result: TrunkBridgeResult) => void,
  intervalMs: number = 2000
) {
  let state = createInitialKineticState(source);

  const timer = setInterval(() => {
    const input = getInput();
    const result = runKineticThroughTrunk(state, input);
    state = result.state;

    if (onStep) {
      onStep(result);
    }
  }, intervalMs);

  return {
    stop: () => clearInterval(timer),
    getState: () => state
  };
}
// kinetic/computekinetics.ts
// Kinetic system output bridge

import { SourceProfile } from '../../core/engine/signal';
import {
  processSlice,
  KineticOrchestratorInput
} from './orchestrator';
import {
  wireInstruments,
  WiredInstrumentOutput
} from './instruments';

import { KineticSnapshot } from './types';
import { DecayEvent } from './instruments/decay-oscillator';

export interface ComputeKineticsInput {
  snapshot: KineticSnapshot;
  previousMid: number;
  anchorMid: number;
  source: SourceProfile;
  previousDecayEvents?: DecayEvent[];
}

export interface ComputeKineticsOutput {
  signals: ReturnType<typeof processSlice>['signals'];
  raw: ReturnType<typeof processSlice>['raw'];
  precision: ReturnType<typeof processSlice>['precision'];
  instruments: WiredInstrumentOutput;
}

/**
 * computeKinetics
 * Coordinates the orchestrator and the instrument wiring logic.
 */
export function computeKinetics(
  input: ComputeKineticsInput
): ComputeKineticsOutput {
  const orchestratorInput: KineticOrchestratorInput = {
    snapshot: input.snapshot,
    previousMid: input.previousMid,
    anchorMid: input.anchorMid,
    source: input.source
  };

  const processed = processSlice(orchestratorInput);

  const instruments = wireInstruments({
    signals: processed.signals,
    previousDecayEvents: input.previousDecayEvents ?? []
  });

  return {
    signals: processed.signals,
    raw: processed.raw,
    precision: processed.precision,
    instruments
  };
}

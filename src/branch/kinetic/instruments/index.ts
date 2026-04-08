// src/branch/kinetic/instruments/index.ts
// Central instrument registry / wiring layer

import { PreparedSignal } from '../../../core/engine/signal';

import { buildAbsorptionField } from './absorption-field';
import { buildTransmissionField } from './transmission-field';
import { buildDecayOscillator, DecayEvent } from './decay-oscillator';
import { buildDecayDivergence } from './decay-divergence';
import { buildStressField } from './stress-field';
import { buildAbsorptionTension } from './absorption-tension';
import { buildTensionPoints } from './tension-points';
import { buildCompressionSpark } from './compression-spark';
import { buildKineticAnchor } from './kinetic-anchor';
import { buildDisplacementField } from './displacement-field';
import { buildRealityGapField } from './reality-gap';

export interface WiredInstrumentOutput {
  absorptionField?: ReturnType<typeof buildAbsorptionField>;
  transmissionField?: ReturnType<typeof buildTransmissionField>;
  decayField?: ReturnType<typeof buildDecayOscillator>;
  coilDecayField?: ReturnType<typeof buildDecayDivergence>;
  stressField?: ReturnType<typeof buildStressField>;
  absorptionTension?: ReturnType<typeof buildAbsorptionTension>;
  tensionLine?: ReturnType<typeof buildTensionPoints>;
  compressionSpark?: ReturnType<typeof buildCompressionSpark>;
  kineticAnchor?: ReturnType<typeof buildKineticAnchor>;
  displacementField?: ReturnType<typeof buildDisplacementField>;
  realityGapField?: ReturnType<typeof buildRealityGapField>;
}

export interface WireInstrumentsInput {
  signals: PreparedSignal[];
  previousDecayEvents?: DecayEvent[];
}

export function wireInstruments(
  input: WireInstrumentsInput
): WiredInstrumentOutput {
  const { signals, previousDecayEvents = [] } = input;

  const output: WiredInstrumentOutput = {};

  for (const signal of signals) {
    switch (signal.dimensionId) {
      case 'absorption':
        output.absorptionField = buildAbsorptionField(signal);
        output.decayField = buildDecayOscillator(signal, previousDecayEvents);
        break;

      case 'mismatch':
        output.stressField = buildStressField(signal);
        break;

      case 'realityGap':
        output.realityGapField = buildRealityGapField(signal);
        output.displacementField = buildDisplacementField(signal);
        break;

      case 'tension':
        output.absorptionTension = buildAbsorptionTension(signal);
        output.tensionLine = buildTensionPoints(signal);
        output.coilDecayField = buildDecayDivergence(signal);
        output.compressionSpark = buildCompressionSpark(signal);
        output.kineticAnchor = buildKineticAnchor(signal);
        break;

      case 'liarIndex':
        output.displacementField = buildDisplacementField(signal);
        break;

      default:
        break;
    }
  }

  const absorptionSignal = signals.find((s) => s.dimensionId === 'absorption');
  if (absorptionSignal) {
    output.transmissionField = buildTransmissionField(absorptionSignal);
  }

  return output;
}

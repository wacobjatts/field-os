// instruments/index.ts
// Central instrument registry / wiring layer

import { PreparedSignal } from '../../../core/engine/signal';

import { buildAbsorptionField } from './absorptionfield';
import { buildTransmissionField } from './transmission';
import { buildDecayField, DecayEvent } from './decayoscillator';
import { buildCoilDecayOscillator } from './decaydivergence';
import { buildStressField } from './stressfield';
import { buildAbsorptionTension } from './tension';
import { buildTensionLine } from './tensionpoints';
import { buildCompressionSpark } from './compressionspark';
import { buildKineticAnchor } from './kineticanchor';
import { buildDisplacementField } from './displacementfield';
import { buildRealityGapField } from './realitygap';

export interface WiredInstrumentOutput {
  absorptionField?: ReturnType<typeof buildAbsorptionField>;
  transmissionField?: ReturnType<typeof buildTransmissionField>;
  decayField?: ReturnType<typeof buildDecayField>;
  coilDecayField?: ReturnType<typeof buildCoilDecayOscillator>;
  stressField?: ReturnType<typeof buildStressField>;
  absorptionTension?: ReturnType<typeof buildAbsorptionTension>;
  tensionLine?: ReturnType<typeof buildTensionLine>;
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
        output.decayField = buildDecayField(signal, previousDecayEvents);
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
        output.tensionLine = buildTensionLine(signal);
        output.coilDecayField = buildCoilDecayOscillator(signal);
        output.compressionSpark = buildCompressionSpark(signal);
        output.kineticAnchor = buildKineticAnchor(signal);
        break;

      case 'liarIndex':
        output.displacementField = buildDisplacementField(signal);
        break;

      case 'entropy':
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

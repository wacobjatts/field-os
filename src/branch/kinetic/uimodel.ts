// kinetic/uimodel.ts
// Converts computeKinetics output into a clean UI-facing model

import { ComputeKineticsOutput } from './computekinetics';

export interface InstrumentCardModel {
  key: string;
  title: string;
  family: string;
  rendererKey: string;
  category: string;
  data: unknown;
}

export interface KineticUIModel {
  chart: {
    activeSymbol: string;
  };
  stack: InstrumentCardModel[];
  rightPanel: {
    raw: ComputeKineticsOutput['raw'];
    precision: ComputeKineticsOutput['precision'];
  };
}

export function buildKineticUIModel(
  symbol: string,
  output: ComputeKineticsOutput
): KineticUIModel {
  const stack: InstrumentCardModel[] = [];

  if (output.instruments.absorptionField) {
    stack.push({
      key: 'absorption-field',
      title: 'Absorption–Compression Field',
      family: 'Absorption',
      rendererKey: 'absorption-field',
      category: 'Absorption',
      data: output.instruments.absorptionField
    });
  }

  if (output.instruments.transmissionField) {
    stack.push({
      key: 'transmission-field',
      title: 'Absorption Transmission Field',
      family: 'Absorption',
      rendererKey: 'transmission-field',
      category: 'Absorption',
      data: output.instruments.transmissionField
    });
  }

  if (output.instruments.decayField) {
    stack.push({
      key: 'decay-field',
      title: 'Absorption Decay Field',
      family: 'Absorption',
      rendererKey: 'decay-field',
      category: 'Absorption',
      data: output.instruments.decayField
    });
  }

  if (output.instruments.stressField) {
    stack.push({
      key: 'stress-field',
      title: 'Stress Field',
      family: 'Mismatch',
      rendererKey: 'stress-field',
      category: 'Mismatch',
      data: output.instruments.stressField
    });
  }

  if (output.instruments.absorptionTension) {
    stack.push({
      key: 'absorption-tension',
      title: 'Absorption Tension',
      family: 'Tension',
      rendererKey: 'absorption-tension',
      category: 'Tension',
      data: output.instruments.absorptionTension
    });
  }

  if (output.instruments.tensionLine) {
    stack.push({
      key: 'tension-line',
      title: 'Tension Line',
      family: 'Tension',
      rendererKey: 'tension-line',
      category: 'Tension',
      data: output.instruments.tensionLine
    });
  }

  if (output.instruments.coilDecayField) {
    stack.push({
      key: 'coil-decay',
      title: 'Coil Decay Oscillator',
      family: 'Tension',
      rendererKey: 'coil-decay',
      category: 'Tension',
      data: output.instruments.coilDecayField
    });
  }

  if (output.instruments.compressionSpark) {
    stack.push({
      key: 'compression-spark',
      title: 'Compression Spark',
      family: 'Tension',
      rendererKey: 'compression-spark',
      category: 'Tension',
      data: output.instruments.compressionSpark
    });
  }

  if (output.instruments.kineticAnchor) {
    stack.push({
      key: 'kinetic-anchor',
      title: 'Kinetic Anchor',
      family: 'Tension',
      rendererKey: 'kinetic-anchor',
      category: 'Tension',
      data: output.instruments.kineticAnchor
    });
  }

  if (output.instruments.displacementField) {
    stack.push({
      key: 'displacement-field',
      title: 'Displacement Field',
      family: 'Displacement',
      rendererKey: 'displacement-field',
      category: 'Displacement',
      data: output.instruments.displacementField
    });
  }

  if (output.instruments.realityGapField) {
    stack.push({
      key: 'reality-gap',
      title: 'Reality Gap',
      family: 'Reality',
      rendererKey: 'reality-gap',
      category: 'Reality',
      data: output.instruments.realityGapField
    });
  }

  return {
    chart: {
      activeSymbol: symbol
    },
    stack,
    rightPanel: {
      raw: output.raw,
      precision: output.precision
    }
  };
}

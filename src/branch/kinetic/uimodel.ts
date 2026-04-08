// src/branch/kinetic/uimodel.ts
// Converts computeKinetics output into a clean UI-facing model aligned with the shell contract

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

/**
 * buildKineticUIModel
 * Rebuilds the instrument stack in the exact order and naming convention 
 * defined by the locked HTML shell.
 */
export function buildKineticUIModel(
  symbol: string,
  output: ComputeKineticsOutput
): KineticUIModel {
  const stack: InstrumentCardModel[] = [];

  // 1. Absorption Tension
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

  // 2. Reality Gap
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

  // 3. Kinetic Anchor
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

  // 4. Decay Oscillator
  if (output.instruments.decayField) {
    stack.push({
      key: 'decay-oscillator',
      title: 'Decay Oscillator',
      family: 'Decay',
      rendererKey: 'decay-oscillator',
      category: 'Decay',
      data: output.instruments.decayField
    });
  }

  // 5. Compression Spark
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

  // 6. Displacement Field
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

  // 7. Stress Field
  if (output.instruments.stressField) {
    stack.push({
      key: 'stress-field',
      title: 'Stress Field',
      family: 'Tension',
      rendererKey: 'stress-field',
      category: 'Tension',
      data: output.instruments.stressField
    });
  }

  // 8. Transmission Field
  if (output.instruments.transmissionField) {
    stack.push({
      key: 'transmission-field',
      title: 'Transmission Field',
      family: 'Absorption',
      rendererKey: 'transmission-field',
      category: 'Absorption',
      data: output.instruments.transmissionField
    });
  }

  // 9. Absorption–Compression
  if (output.instruments.absorptionField) {
    stack.push({
      key: 'absorption-field',
      title: 'Absorption–Compression',
      family: 'Absorption',
      rendererKey: 'absorption-field',
      category: 'Absorption',
      data: output.instruments.absorptionField
    });
  }

  // 10. Tension Line
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

  // 11. Decay Divergence (Source: coilDecayField)
  if (output.instruments.coilDecayField) {
    stack.push({
      key: 'decay-divergence',
      title: 'Decay Divergence',
      family: 'Tension',
      rendererKey: 'decay-divergence',
      category: 'Tension',
      data: output.instruments.coilDecayField
    });
  }

  // 12. Tension Points (Source: tensionLine mapping)
  if (output.instruments.tensionLine) {
    stack.push({
      key: 'tension-points',
      title: 'Tension Points',
      family: 'Tension',
      rendererKey: 'tension-points',
      category: 'Tension',
      data: output.instruments.tensionLine
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

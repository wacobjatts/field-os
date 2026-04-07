/**
 * src/branch/kinetic/orchestrator.ts
 *
 * Kinetic branch orchestration for one market-data slice.
 * Computes branch-side observations, derives their precision,
 * normalizes where needed, and translates them into PreparedSignal[].
 */

import { PreparedSignal, SourceProfile } from '../../core/engine/signal';

import { KINETIC_DIMENSIONS } from './dimensions';
import { normalizeRealityGap } from './normalization/normalize';
import { calculateAbsorption } from './calculators/absorption';
import { calculateMismatch } from './calculators/mismatch';
import { calculateRealityGap } from './calculators/realitygap';
import { calculateTension } from './calculators/tension';
import { calculateLiarIndex } from './calculators/liarindex';
import { calculateEntropy } from './calculators/entropy';

import { calculateAbsorptionPrecision } from './precision/absorptionprecision';
import { calculateMismatchPrecision } from './precision/mismatchprecision';
import { calculateRealityGapPrecision } from './precision/realitygapprecision';
import { calculateTensionPrecision } from './precision/tensionprecision';
import { calculateLiarIndexPrecision } from './precision/liarindexprecision';
import { calculateEntropyPrecision } from './precision/entropyprecision';

import { toPreparedSignal } from './translator';
import { KineticSnapshot } from './types';

export interface KineticOrchestratorInput {
  snapshot: KineticSnapshot;
  previousMid: number;
  anchorMid: number;
  source: SourceProfile;
}

export interface KineticOrchestratorOutput {
  signals: PreparedSignal[];
  raw: {
    absorption: number;
    mismatch: number;
    realityGap: number;
    normalizedRealityGap: number;
    tension: number;
    liarIndex: number;
    entropy: number;
  };
  precision: {
    absorption: number;
    mismatch: number;
    realityGap: number;
    tension: number;
    liarIndex: number;
    entropy: number;
  };
}

/**
 * processSlice
 * The main entry point for the Kinetic Branch.
 * Transforms a raw data slice into a multi-dimensional physical vector for FieldOS.
 */
export function processSlice(
  input: KineticOrchestratorInput
): KineticOrchestratorOutput {
  const { snapshot, previousMid, anchorMid, source } = input;

  const currentMid = (snapshot.book.bestBid + snapshot.book.bestAsk) / 2;
  const displacement = Math.abs(currentMid - previousMid);

  const absorption = calculateAbsorption(snapshot, previousMid);
  const mismatch = calculateMismatch(snapshot.trades);
  const realityGap = calculateRealityGap(snapshot, anchorMid);
  const normalizedRealityGap = normalizeRealityGap(realityGap, currentMid);
  const tension = calculateTension(mismatch, absorption);
  const liarIndex = calculateLiarIndex(realityGap, displacement);
  const entropy = calculateEntropy(snapshot);

  const absorptionPrecision = calculateAbsorptionPrecision(snapshot);
  const mismatchPrecision = calculateMismatchPrecision(snapshot.trades);
  const realityGapPrecision = calculateRealityGapPrecision(
    snapshot.book,
    snapshot.timestamp
  );
  const tensionPrecision = calculateTensionPrecision(
    mismatchPrecision,
    absorptionPrecision
  );
  const liarIndexPrecision = calculateLiarIndexPrecision(
    realityGapPrecision,
    snapshot.trades
  );
  const entropyPrecision = calculateEntropyPrecision(snapshot);

  const signals: PreparedSignal[] = [
    toPreparedSignal(
      KINETIC_DIMENSIONS.absorption.id,
      absorption,
      absorptionPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.absorption
    ),
    toPreparedSignal(
      KINETIC_DIMENSIONS.mismatch.id,
      mismatch,
      mismatchPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.mismatch
    ),
    toPreparedSignal(
      KINETIC_DIMENSIONS.realityGap.id,
      normalizedRealityGap,
      realityGapPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.realityGap
    ),
    toPreparedSignal(
      KINETIC_DIMENSIONS.tension.id,
      tension,
      tensionPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.tension
    ),
    toPreparedSignal(
      KINETIC_DIMENSIONS.liarIndex.id,
      liarIndex,
      liarIndexPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.liarIndex
    ),
    toPreparedSignal(
      KINETIC_DIMENSIONS.entropy.id,
      entropy,
      entropyPrecision,
      snapshot.timestamp,
      source,
      KINETIC_DIMENSIONS.entropy
    )
  ];

  return {
    signals,
    raw: {
      absorption,
      mismatch,
      realityGap,
      normalizedRealityGap,
      tension,
      liarIndex,
      entropy
    },
    precision: {
      absorption: absorptionPrecision,
      mismatch: mismatchPrecision,
      realityGap: realityGapPrecision,
      tension: tensionPrecision,
      liarIndex: liarIndexPrecision,
      entropy: entropyPrecision
    }
  };
}

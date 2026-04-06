/**
 * KINETIC SYSTEM ORCHESTRATOR
 * TYPE: Unified Measurement Pipeline
 * DOMAIN: Structural Physics
 * * Aggregates individual kinetic instruments into a single deterministic 
 * computation pass for a given market slice.
 */

import { measureMismatch } from '../instruments/mismatch';
import { measureAbsorption } from '../instruments/absorption';
import { measureTension } from '../instruments/tension';
import { measureRealityGap } from '../instruments/realityGap';
import { measureLiarIndex } from '../instruments/liarIndex';

export interface KineticInput {
  book: {
    bestBid: number;
    bestBidSize: number;
    bestAsk: number;
    bestAskSize: number;
  };
  trades: {
    buyWork: number;
    sellWork: number;
  };
  previousMid: number;
  anchorMid: number;
}

export interface KineticResults {
  mismatch: number;
  absorption: number;
  tension: number;
  realityGap: number;
  liarIndex: number;
}

/**
 * COMPUTE KINETICS
 * Executes the full measurement pipeline in sequence.
 * This function is pure and deterministic.
 */
export function computeKinetics(input: KineticInput): KineticResults {
  const { book, trades, previousMid, anchorMid } = input;

  // STEP 1: Calculate Force Mismatch (Directional Bias)
  const mismatch = measureMismatch(trades);

  // STEP 2: Calculate Absorption (Efficiency / Resistance)
  const absorption = measureAbsorption(
    { book, trades },
    previousMid
  );

  // STEP 3: Calculate Tension (Coiled Potential Energy)
  const tension = measureTension(mismatch, absorption);

  // STEP 4: Calculate Reality Gap (Distance from Structural Anchor)
  const realityGap = measureRealityGap({ book }, anchorMid);

  // STEP 5: Calculate Displacement (Absolute Distance Moved since last slice)
  const currentMid = (book.bestBid + book.bestAsk) / 2;
  const displacement = Math.abs(currentMid - previousMid);

  // STEP 6: Calculate Liar Index (Positional Authenticity)
  const liarIndex = measureLiarIndex(realityGap, displacement);

  return {
    mismatch,
    absorption,
    tension,
    realityGap,
    liarIndex
  };
}


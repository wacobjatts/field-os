/**
 * src/core/engine/governor.ts
 * * The Unified Cosmological Orchestrator (v2.1).
 * "Space (Trust) tells matter how to move; Matter (Belief) tells space how to curve."
 */

import { Manifold, getBeliefOrDefault } from './manifold';
import { PreparedSignal, SourceProfile } from './signal';
import { fuseSignal, InferenceResult } from './inference';
import { evolveManifold } from './dynamics';
import { StrategyPFC, StrategicUtility } from './strategy';

/** -------------------------
 * Cosmological Constants
 * ------------------------- */
const KARMA_HEALING_MAX = 0.05;    // Max rate of vacuum recovery
const KARMA_SHOCK_FACTOR = 0.10;   // Scaling factor for 'Space' contraction
const SURPRISE_THRESHOLD = 3.0;    // Point where tension becomes 'Shock'
const DEFAULT_SOURCE_CREDIBILITY = 0.5;

/** -------------------------
 * The Governor (The Tenzo)
 * ------------------------- */

export interface SystemState {
  manifold: Manifold;
  sources: Record<string, SourceProfile>;
  lastAssessment: StrategicUtility;
  latestResults: InferenceResult[];
  timestamp: number;
}

export class Governor {

  /**
   * Facilitate: The Unified Heartbeat.
   * Executes the 5-Phase Dance of Space and Matter.
   */
  static facilitate(
    state: SystemState,
    signals: PreparedSignal[],
    newTimestamp: number
  ): SystemState {
    
    // --- Phase 1: THE DRIFT (Expansion) ---
    const evolved = evolveManifold(state.manifold, newTimestamp);

    // --- Phase 2: THE PRE-ASSESSMENT (The Witness) ---
    const preAssessment = StrategyPFC.evaluate(
      evolved, 
      [], 
      state.lastAssessment?.urgency || 0
    );

    const updatedBeliefs = { ...evolved.beliefs };
    const sourceRegistry = { ...state.sources };
    const inferenceResults: InferenceResult[] = [];

    // Determine the 'Command Factor' - How much the PFC trusts the current mode
    let commandFactor = 1.0;
    switch (preAssessment.command) {
      case 'REFINE': commandFactor = 0.6; break; // Caution: High tension detected
      case 'COMMIT': commandFactor = 1.3; break; // Boldness: High stability detected
      case 'GATHER': commandFactor = 1.0; break; // Neutral: Seeking clarity
      case 'HALT':   commandFactor = 0.0; break; // Emergency: Stop all fusion
    }

    // --- Phase 3: THE INTERACTION (Space & Matter) ---
    if (preAssessment.command !== 'HALT') {
      for (const signal of signals) {
        const source = sourceRegistry[signal.sourceId];
        if (!source) continue; // No ghost signals in the manifold

        const prior = getBeliefOrDefault(evolved, signal.dimensionId);

        // A. MATTER TELLS SPACE HOW TO CURVE (Inertia)
        const inertia = 1 + Math.log(1 + prior.precision);

        // B. SPACE TELLS MATTER HOW TO MOVE (Permeability)
        const permeability = Math.pow(source.credibility || DEFAULT_SOURCE_CREDIBILITY, 2);

        // C. THE FUSION (Alpha Calculation)
        const rawAlpha = (preAssessment.resourceAllocation * commandFactor * permeability) / inertia;
        const alpha = Math.max(0, Math.min(1, rawAlpha));
        
        const result = fuseSignal(prior, signal, alpha);

        if (!result.isIgnored) {
          // D. KARMA (Scaled Reciprocity)
          let delta = 0;
          if (result.surprise > SURPRISE_THRESHOLD) {
            // Logarithmic penalty: Larger shocks cause exponentially decaying trust
            delta = -KARMA_SHOCK_FACTOR * Math.log(1 + result.surprise);
          } else {
            // Asymptotic healing: Trust recovers faster when it's low
            delta = KARMA_HEALING_MAX * (1 - source.credibility);
          }

          // IMMUTABLE SOURCE UPDATE
          sourceRegistry[signal.sourceId] = {
            ...source,
            credibility: Math.max(0.01, Math.min(1.0, source.credibility + delta))
          };

          updatedBeliefs[signal.dimensionId] = result.posterior;
          inferenceResults.push(result);
        }
      }
    }

    // --- Phase 4: THE POST-ASSESSMENT (Metabolic Impact) ---
    const postAssessment = StrategyPFC.evaluate(
      { ...evolved, beliefs: updatedBeliefs }, 
      inferenceResults, 
      preAssessment.urgency
    );

    // --- Phase 5: COMMITMENT ---
    return {
      manifold: { ...evolved, beliefs: updatedBeliefs },
      sources: sourceRegistry,
      lastAssessment: postAssessment,
      latestResults: inferenceResults,
      timestamp: newTimestamp
    };
  }
}


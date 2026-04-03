/**
 * src/core/engine/tenzo.ts
 * The Unified Cosmological Orchestrator (v2.1).
 * "Space (Trust) tells matter how to move; Matter (Belief) tells space how to curve."
 */

import { Manifold, getBeliefOrDefault } from './manifold';
import { PreparedSignal, SourceProfile } from './signal';
import { fuseSignal, InferenceResult } from './inference';
import { evolveManifold } from './dynamics';
import { StrategyPFC, StrategicUtility } from './strategy';

const KARMA_HEALING_MAX = 0.05;    
const KARMA_SHOCK_FACTOR = 0.10;   
const SURPRISE_THRESHOLD = 3.0;    
const DEFAULT_SOURCE_CREDIBILITY = 0.5;

export interface SystemState {
  manifold: Manifold;
  sources: Record<string, SourceProfile>;
  lastAssessment: StrategicUtility;
  latestResults: InferenceResult[];
  timestamp: number;
}

// RENAMED TO TENZO FOR CONSISTENCY
export class Tenzo {

  static facilitate(
    state: SystemState,
    signals: PreparedSignal[],
    newTimestamp: number
  ): SystemState {
    
    // --- Phase 1: THE DRIFT ---
    const evolved = evolveManifold(state.manifold, newTimestamp);

    // --- Phase 2: THE PRE-ASSESSMENT ---
    const preAssessment = StrategyPFC.evaluate(
      evolved, 
      [], 
      state.lastAssessment?.urgency || 0
    );

    const updatedBeliefs = { ...evolved.beliefs };
    const sourceRegistry = { ...state.sources };
    const inferenceResults: InferenceResult[] = [];

    let commandFactor = 1.0;
    switch (preAssessment.command) {
      case 'REFINE': commandFactor = 0.6; break; 
      case 'COMMIT': commandFactor = 1.3; break; 
      case 'GATHER': commandFactor = 1.0; break; 
      case 'HALT':   commandFactor = 0.0; break; 
    }

    // --- Phase 3: THE INTERACTION ---
    if (preAssessment.command !== 'HALT') {
      for (const signal of signals) {
        const source = sourceRegistry[signal.sourceId];
        if (!source) continue; 

        const prior = getBeliefOrDefault(evolved, signal.dimensionId);

        // MATTER TELLS SPACE HOW TO CURVE (Inertia)
        const inertia = 1 + Math.log(1 + prior.precision);

        // SPACE TELLS MATTER HOW TO MOVE (Permeability)
        const permeability = Math.pow(source.credibility || DEFAULT_SOURCE_CREDIBILITY, 2);

        const rawAlpha = (preAssessment.resourceAllocation * commandFactor * permeability) / inertia;
        const alpha = Math.max(0, Math.min(1, rawAlpha));
        
        const result = fuseSignal(prior, signal, alpha);

        if (!result.isIgnored) {
          let delta = 0;
          if (result.surprise > SURPRISE_THRESHOLD) {
            delta = -KARMA_SHOCK_FACTOR * Math.log(1 + result.surprise);
          } else {
            delta = KARMA_HEALING_MAX * (1 - source.credibility);
          }

          sourceRegistry[signal.sourceId] = {
            ...source,
            credibility: Math.max(0.01, Math.min(1.0, source.credibility + delta))
          };

          updatedBeliefs[signal.dimensionId] = result.posterior;
          inferenceResults.push(result);
        }
      }
    }

    // --- Phase 4: THE POST-ASSESSMENT ---
    const postAssessment = StrategyPFC.evaluate(
      { ...evolved, beliefs: updatedBeliefs }, 
      inferenceResults, 
      preAssessment.urgency
    );

    return {
      manifold: { ...evolved, beliefs: updatedBeliefs },
      sources: sourceRegistry,
      lastAssessment: postAssessment,
      latestResults: inferenceResults,
      timestamp: newTimestamp
    };
  }
}

/**
 * src/core/engine/strategy.ts
 * * The Prefrontal Cortex (PFC).
 * High-Density Predictive Control & Active Inference.
 * Orchestrates systemic utility to minimize Variational Free Energy.
 */

import { Manifold, getLocalEntropy } from './manifold';
import { InferenceResult } from './inference';

/** -------------------------
 * Named Strategic Constants
 * ------------------------- */

export const COHERENCE_PRIORITY = 0.75;           // Weight of Surprise vs Entropy in Gamma
export const ACTION_THRESHOLD = 0.80;             // Required confidence % to 'COMMIT'
export const ACTIONABLE_PRECISION_THRESHOLD = 5.0; // The 'Certainty' floor for a dimension
export const CRITICAL_STRESS_LIMIT = 20.0;        // Total Gamma threshold for system HALT
export const HYSTERESIS_BUFFER = 0.10;            // Prevents rapid mode-flipping/jitter

/** -------------------------
 * Strategic Command Types
 * ------------------------- */

/**
 * GATHER: High entropy detected; prioritize information seeking.
 * COMMIT: High confidence and low tension; state is actionable.
 * REFINE: High tension ratio; prioritize resolving prediction error/conflict.
 * HALT:   Critical systemic stress; unsafe to continue normal operations.
 */
export type StrategicCommand = 'GATHER' | 'COMMIT' | 'REFINE' | 'HALT';

export interface StrategicUtility {
  command: StrategicCommand;
  urgency: number;            // [0, 1] Normalized pressure to execute command
  resourceAllocation: number; // [0, 1] Normalized information-seeking/compute effort
  systemStress: number;       // The aggregate Γ (Gamma) score
  totalEntropy: number;       // Total uncertainty across manifold
  totalSurprise: number;      // Total prediction error across manifold
  confidence: number;         // [0, 1] Ratio of actionable dimensions
}

/** -------------------------
 * The PFC Logic
 * ------------------------- */

export class StrategyPFC {

  /**
   * Evaluates the Manifold and determines the Strategic Command.
   * Logic: Minimize Γ = (Weight * Surprise) + ((1 - Weight) * Entropy)
   * * @param manifold The current belief state
   * @param latestResults Recent inference results for surprise/tension calculation
   * @param previousUrgency The urgency from the prior tick to apply hysteresis
   */
  static evaluate(
    manifold: Manifold,
    latestResults: InferenceResult[] = [],
    previousUrgency: number = 0
  ): StrategicUtility {
    
    // 1. Calculate Information Metrics
    const totalEntropy = Object.values(manifold.beliefs)
      .reduce((acc, b) => acc + getLocalEntropy(b), 0);
      
    const totalSurprise = latestResults
      .reduce((acc, r) => acc + (r.isIgnored ? 0 : r.surprise), 0);

    // 2. Objective Function: System Stress (Γ)
    const systemStress = (COHERENCE_PRIORITY * totalSurprise) + 
                         ((1 - COHERENCE_PRIORITY) * totalEntropy);

    // 3. Tension Ratio (Surprise relative to total Information Pressure)
    const tensionRatio = totalSurprise / (totalSurprise + totalEntropy + 1e-6);

    // 4. Actionable Certainty (Confidence)
    const beliefArray = Object.values(manifold.beliefs);
    const totalDimensions = beliefArray.length || 1;
    const confidentDimensions = beliefArray
      .filter(b => b.precision >= ACTIONABLE_PRECISION_THRESHOLD).length;
    const confidence = confidentDimensions / totalDimensions;

    // 5. Command Selection Logic
    let command: StrategicCommand = 'GATHER';
    
    if (systemStress > CRITICAL_STRESS_LIMIT) {
      command = 'HALT';
    } else if (tensionRatio > 0.6) {
      // High conflict regardless of entropy level
      command = 'REFINE';
    } else if (confidence >= ACTION_THRESHOLD && tensionRatio < 0.2) {
      // High certainty and low conflict
      command = 'COMMIT';
    } else {
      // Default state when uncertainty is the primary driver
      command = 'GATHER';
    }

    // 6. Urgency Calculation & Hysteresis
    // Map system stress to a [0, 1] range
    let rawUrgency = Math.max(0, Math.min(1, systemStress / CRITICAL_STRESS_LIMIT));

    // Apply Hysteresis: Only shift urgency if change exceeds the buffer
    const urgency = Math.abs(rawUrgency - previousUrgency) < HYSTERESIS_BUFFER 
      ? previousUrgency 
      : rawUrgency;

    return {
      command,
      urgency,
      resourceAllocation: Math.max(0.1, urgency), // Lower bound safety for compute
      systemStress,
      totalEntropy,
      totalSurprise,
      confidence
    };
  }
}


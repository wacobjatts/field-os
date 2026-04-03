/**
 * src/core/engine/inference.ts
 *
 * The Inference Engine (The Thalamus).
 * Fuses calibrated PreparedSignals into the Manifold using 
 * Precision-Weighted Bayesian Updating with Plasticity Guards.
 */

import {
  Belief,
  Manifold,
  getBeliefOrDefault,
  getGaussianKLDivergence,
  getLocalEntropy,
  precisionToVariance,
  varianceToPrecision,
  MIN_PRECISION
} from './manifold';

import { PreparedSignal } from './signal';

/** -------------------------
 * Constants & Safeguards
 * ------------------------- */

/**
 * Prevents 'Precision Hardening'.
 * Ensures the manifold remains 'Open' to new evidence by 
 * capping the maximum internal certainty.
 */
export const MAX_PRECISION_LIMIT = 1e8;

/**
 * Global Default Learning Rate (α).
 * 1.0 = Pure Bayesian update.
 * < 1.0 = Conservative/Damped update.
 */
export const DEFAULT_LEARNING_RATE = 1.0;

/** -------------------------
 * Type Definitions
 * ------------------------- */

export interface InferenceResult {
  dimensionId: string;
  prior: Belief;
  posterior: Belief;
  surprise: number;        // Normalized Prediction Error (S)
  informationGain: number; // KL Divergence (D_kl) in Nats
  entropyChange: number;   // ΔH (Reduction in uncertainty)
  isIgnored: boolean;      // True if causal/time guard rejected the update
}

export interface ManifoldUpdate {
  manifold: Manifold;
  result: InferenceResult;
}

/** -------------------------
 * Core Inference Logic
 * ------------------------- */

/**
 * Calculates the 'Surprise' (Normalized Prediction Error).
 * S = (error^2) / (prior_var + signal_var)
 */
export function calculateSurprise(prior: Belief, signal: PreparedSignal): number {
  const priorVar = precisionToVariance(prior.precision);
  const signalVar = precisionToVariance(signal.effectivePrecision);
  const totalVar = priorVar + signalVar;
  
  const error = signal.adjustedValue - prior.mean;
  return (error * error) / totalVar;
}

/**
 * Atomic Fusion: prior + evidence = posterior.
 * Implements Precision-Weighted Averaging with plasticity and causal guards.
 */
export function fuseSignal(
  prior: Belief, 
  signal: PreparedSignal,
  learningRate: number = DEFAULT_LEARNING_RATE
): InferenceResult {
  // 1. Causal Guard: No-op if signal is from the 'past' relative to current belief
  if (signal.timestamp < prior.lastUpdated) {
    return {
      dimensionId: signal.dimensionId,
      prior,
      posterior: prior,
      surprise: 0,
      informationGain: 0,
      entropyChange: 0,
      isIgnored: true
    };
  }

  // Ensure learningRate is safely clamped to [0, 1]
  const alpha = Math.max(0, Math.min(1, learningRate));

  // 2. Calculate Surprise
  const surprise = calculateSurprise(prior, signal);

  // 3. Posterior Precision: Precision is additive (ω_post = ω_prior + ω_sig)
  // Apply Plasticity Guard (MAX_PRECISION_LIMIT)
  const rawPosteriorPrecision = prior.precision + signal.effectivePrecision;
  const posteriorPrecision = Math.min(rawPosteriorPrecision, MAX_PRECISION_LIMIT);

  // 4. Posterior Mean: Weighted average (μ_post = (μ_p*ω_p + μ_s*ω_s) / ω_post)
  const weightedPrior = prior.mean * prior.precision;
  const weightedSignal = signal.adjustedValue * signal.effectivePrecision;
  
  // The 'Bayesian Target' mean
  const targetMean = (weightedPrior + weightedSignal) / rawPosteriorPrecision;
  
  // Apply Learning Rate (α) Damping to the mean shift
  const posteriorMean = prior.mean + (targetMean - prior.mean) * alpha;

  const posterior: Belief = {
    mean: posteriorMean,
    precision: posteriorPrecision,
    lastUpdated: signal.timestamp
  };

  // 5. Information Metrics
  const informationGain = getGaussianKLDivergence(posterior, prior);
  const entropyChange = getLocalEntropy(prior) - getLocalEntropy(posterior);

  return {
    dimensionId: signal.dimensionId,
    prior,
    posterior,
    surprise,
    informationGain,
    entropyChange,
    isIgnored: false
  };
}

/**
 * Manifold-Level Orchestrator.
 * Fuses a signal into a single dimension and returns the new Manifold 
 * alongside the metabolic results of the update.
 */
export function updateManifold(
  manifold: Manifold, 
  signal: PreparedSignal,
  learningRate: number = DEFAULT_LEARNING_RATE
): ManifoldUpdate {
  const prior = getBeliefOrDefault(manifold, signal.dimensionId);
  
  const result = fuseSignal(prior, signal, learningRate);

  // Return original manifold if the update was ignored
  if (result.isIgnored) {
    return { manifold, result };
  }

  const updatedManifold: Manifold = {
    ...manifold,
    beliefs: {
      ...manifold.beliefs,
      [signal.dimensionId]: result.posterior
    }
  };

  return {
    manifold: updatedManifold,
    result
  };
}


/**
 * src/core/engine/dynamics.ts
 *
 * The Temporal Layer (Internal Physics).
 * Implements Entropy Drift and Mean Evolution to model 
 * the decay of information and systemic change over time.
 */

import {
  Belief,
  Manifold,
  MIN_PRECISION,
  precisionToVariance,
  varianceToPrecision,
  getLocalEntropy
} from './manifold';

/** -------------------------
 * Constants & Safeguards
 * ------------------------- */

/**
 * Standard internal time conversion: Milliseconds to Seconds.
 */
export const MS_TO_S = 1 / 1000;

/**
 * Prevents numerical explosion if the system clock jumps 
 * or the loop is suspended for a long duration.
 */
export const MAX_DT_SECONDS = 3600; // 1 hour cap per step

/** -------------------------
 * Type Definitions
 * ------------------------- */

/**
 * Defines how a specific dimension evolves in the absence of signals.
 */
export interface DriftProfile {
  dimensionId: string;
  /** Variance added per second (σ²_drift/s) */
  diffusionRate: number; 
  /** Constant change in mean per second (v/s) */
  velocity?: number;
  /** Change in velocity per second (a/s²) */
  acceleration?: number;
}

/**
 * The outcome of a temporal evolution step.
 */
export interface EvolutionResult {
  prior: Belief;
  evolved: Belief;
  dtSeconds: number;
  entropyInjected: number; // ΔH (Positive = increased uncertainty)
}

/** -------------------------
 * Core Dynamics Logic
 * ------------------------- */

/**
 * Evolves a single belief atom across a time delta.
 * Uses Additive Variance Drift: σ²_now = σ²_prev + (diffusion * dt)
 */
export function evolveBelief(
  prior: Belief,
  dtSeconds: number,
  profile?: DriftProfile
): EvolutionResult {
  // 1. No-op Causal Guard: No evolution for zero or negative time.
  if (dtSeconds <= 0) {
    return { 
      prior, 
      evolved: prior, 
      dtSeconds: 0, 
      entropyInjected: 0 
    };
  }

  // 2. Numerical Guard: Cap the time delta to prevent variance overflow.
  const dt = Math.min(dtSeconds, MAX_DT_SECONDS);

  const diffusion = profile?.diffusionRate ?? 0;
  const velocity = profile?.velocity ?? 0;
  const acceleration = profile?.acceleration ?? 0;

  // 3. Mean Evolution (Kinematics)
  // μ_new = μ + (v * dt) + (0.5 * a * dt²)
  const velocityShift = (velocity * dt) + (0.5 * acceleration * dt * dt);
  const evolvedMean = prior.mean + velocityShift;

  // 4. Precision Decay (Entropy Drift)
  // Convert to variance space to add the 'Process Noise'.
  const priorVar = precisionToVariance(prior.precision);
  const noiseAdded = diffusion * dt;
  const evolvedVar = priorVar + noiseAdded;
  
  // Convert back to precision, ensuring we stay above absolute floor.
  const evolvedPrecision = Math.max(
    varianceToPrecision(evolvedVar),
    MIN_PRECISION
  );

  const evolved: Belief = {
    mean: evolvedMean,
    precision: evolvedPrecision,
    lastUpdated: prior.lastUpdated + (dt * 1000)
  };

  // 5. Information Metrics: Measure the entropy 'leak'
  const entropyInjected = getLocalEntropy(evolved) - getLocalEntropy(prior);

  return {
    prior,
    evolved,
    dtSeconds: dt,
    entropyInjected
  };
}

/**
 * Manifold-Level Orchestrator.
 * Advances the entire manifold's state to 'now' based on individual drift profiles.
 */
export function evolveManifold(
  manifold: Manifold,
  now: number,
  driftProfiles: Record<string, DriftProfile> = {}
): Manifold {
  const evolvedBeliefs: Record<string, Belief> = {};

  for (const [id, belief] of Object.entries(manifold.beliefs)) {
    const dtSeconds = (now - belief.lastUpdated) * MS_TO_S;
    const profile = driftProfiles[id];
    
    const result = evolveBelief(belief, dtSeconds, profile);
    evolvedBeliefs[id] = result.evolved;
  }

  return {
    ...manifold,
    beliefs: evolvedBeliefs
  };
}

/**
 * Diagnostic helper to calculate the total uncertainty injected 
 * into the manifold during the last evolution step.
 */
export function calculateGlobalEntropyDrift(
  prior: Manifold,
  evolved: Manifold
): number {
  let totalInjected = 0;
  for (const id in evolved.beliefs) {
    const pBelief = prior.beliefs[id];
    const eBelief = evolved.beliefs[id];
    if (pBelief && eBelief) {
      totalInjected += getLocalEntropy(eBelief) - getLocalEntropy(pBelief);
    }
  }
  return totalInjected;
}


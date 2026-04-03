/**
 * src/core/engine/manifold.ts
 *
 * The geometric and topological foundation of the engine.
 * * This file treats system belief as a precision-weighted probability manifold.
 * It is domain-agnostic and supports:
 * - Observed / Latent / Derived dimensions
 * - Local and Global Shannon Entropy
 * - KL Divergence (D_KL) as the core information-theoretic metric
 */

/** -------------------------
 * Constants / Numerical Safety
 * ------------------------- */

/**
 * Prevents singularities when precision approaches zero.
 * Precision (ω) = 1 / variance (σ²)
 */
export const MIN_PRECISION = 1e-12;
export const EPSILON_PRECISION = 1e-12;

/**
 * A weak starting prior for new dimensions (High Entropy).
 */
export const DEFAULT_PRIOR_PRECISION = 1e-6;

/**
 * Small positive value for log-safety.
 */
export const EPSILON = 1e-12;

/** -------------------------
 * Type Definitions
 * ------------------------- */

export type DimensionKind = 'observed' | 'latent' | 'derived';

/**
 * A single belief atom.
 * Represents a univariate Gaussian in the manifold.
 */
export interface Belief {
  mean: number;
  precision: number; // ω = 1 / σ²
  lastUpdated: number;
}

/**
 * Describes the semantics and rules of a dimension.
 */
export interface DimensionDescriptor {
  id: string;
  kind: DimensionKind;
  units?: string;
  tags: string[];
  bounds?: {
    min?: number;
    max?: number;
  };
  /** Functional mapping for derived dimensions */
  transform?: (m: Manifold) => number;
}

/**
 * A domain-agnostic probabilistic manifold.
 * The 'Mental Model' of the Amorphous Loop.
 */
export interface Manifold {
  id: string;
  label: string;
  beliefs: Record<string, Belief>;
  topology: Record<string, DimensionDescriptor>;
}

/** -------------------------
 * Conversion & Safety Helpers
 * ------------------------- */

export function clampPrecision(precision: number): number {
  if (!Number.isFinite(precision)) return MIN_PRECISION;
  return Math.max(precision, MIN_PRECISION);
}

export function precisionToVariance(precision: number): number {
  return 1 / clampPrecision(precision);
}

export function varianceToPrecision(variance: number): number {
  if (!Number.isFinite(variance) || variance <= 0) return MIN_PRECISION;
  return Math.max(1 / variance, MIN_PRECISION);
}

/**
 * Enforces topological constraints on a value.
 */
export function clampToDescriptorBounds(
  value: number,
  descriptor: DimensionDescriptor
): number {
  if (!descriptor.bounds) return value;
  let clamped = value;
  if (descriptor.bounds.min !== undefined) clamped = Math.max(clamped, descriptor.bounds.min);
  if (descriptor.bounds.max !== undefined) clamped = Math.min(clamped, descriptor.bounds.max);
  return clamped;
}

/**
 * Returns a belief for a dimension, defaulting to a weak prior if missing.
 * Supports 'Amorphous' expansion.
 */
export function getBeliefOrDefault(
  manifold: Manifold,
  key: string,
  fallbackMean = 0,
  fallbackPrecision = DEFAULT_PRIOR_PRECISION
): Belief {
  const belief = manifold.beliefs[key];
  return belief ? {
    ...belief,
    precision: clampPrecision(belief.precision)
  } : {
    mean: fallbackMean,
    precision: clampPrecision(fallbackPrecision),
    lastUpdated: 0
  };
}

/** -------------------------
 * Information Metrics (Entropy)
 * ------------------------- */

/**
 * Local Shannon Entropy (H_i) in Nats.
 * H = 0.5 * ln(2 * π * e * σ²)
 */
export function getLocalEntropy(belief: Belief): number {
  const variance = precisionToVariance(belief.precision);
  return 0.5 * Math.log(2 * Math.PI * Math.E * variance);
}

/**
 * Aggregate Manifold Entropy (H_total).
 * Represents the total systemic uncertainty.
 */
export function getGlobalEntropy(manifold: Manifold): number {
  return Object.values(manifold.beliefs).reduce(
    (acc, b) => acc + getLocalEntropy(b), 
    0
  );
}

/**
 * Maps the uncertainty across the manifold.
 */
export function getEntropyGradient(manifold: Manifold): Record<string, number> {
  const gradient: Record<string, number> = {};
  for (const key in manifold.beliefs) {
    gradient[key] = getLocalEntropy(manifold.beliefs[key]);
  }
  return gradient;
}

/** -------------------------
 * Information Metrics (KL Divergence)
 * ------------------------- */

/**
 * Atomic KL Divergence: D_KL(Posterior || Prior)
 * Measures Information Gain / Surprise.
 */
export function getGaussianKLDivergence(
  posterior: Belief,
  prior: Belief
): number {
  const pVar = precisionToVariance(posterior.precision);
  const qVar = precisionToVariance(prior.precision);
  const meanDelta = posterior.mean - prior.mean;

  const logTerm = Math.log(Math.max(qVar / pVar, EPSILON));
  const varTerm = (pVar + meanDelta * meanDelta) / Math.max(qVar, EPSILON);

  const kl = 0.5 * (logTerm + varTerm - 1);
  return Number.isFinite(kl) ? Math.max(kl, 0) : 0;
}

/**
 * Aggregate KL Divergence across two manifolds.
 */
export function getManifoldKLDivergence(
  posterior: Manifold,
  prior: Manifold
): number {
  const keys = new Set([...Object.keys(posterior.beliefs), ...Object.keys(prior.beliefs)]);
  let total = 0;
  for (const key of keys) {
    total += getGaussianKLDivergence(
      getBeliefOrDefault(posterior, key),
      getBeliefOrDefault(prior, key)
    );
  }
  return total;
}

/** -------------------------
 * Lifecycle & Mutation
 * ------------------------- */

export function hasDimension(manifold: Manifold, key: string): boolean {
  return !!manifold.topology[key];
}

export function createManifold(id: string, label: string): Manifold {
  return { id, label, beliefs: {}, topology: {} };
}

/**
 * Non-destructive expansion of the manifold topology.
 */
export function expand(
  manifold: Manifold,
  descriptor: DimensionDescriptor,
  initialBelief?: Belief
): Manifold {
  if (hasDimension(manifold, descriptor.id)) return manifold;

  const belief = initialBelief ?? {
    mean: 0,
    precision: DEFAULT_PRIOR_PRECISION,
    lastUpdated: Date.now()
  };

  return {
    ...manifold,
    topology: { ...manifold.topology, [descriptor.id]: descriptor },
    beliefs: {
      ...manifold.beliefs,
      [descriptor.id]: {
        ...belief,
        mean: clampToDescriptorBounds(belief.mean, descriptor),
        precision: clampPrecision(belief.precision)
      }
    }
  };
}

/**
 * Information Hygiene: Ensures all beliefs respect topological bounds.
 */
export function sanitize(manifold: Manifold): Manifold {
  const sanitized: Record<string, Belief> = {};
  for (const [key, belief] of Object.entries(manifold.beliefs)) {
    const desc = manifold.topology[key];
    sanitized[key] = {
      ...belief,
      mean: desc ? clampToDescriptorBounds(belief.mean, desc) : belief.mean,
      precision: clampPrecision(belief.precision)
    };
  }
  return { ...manifold, beliefs: sanitized };
}


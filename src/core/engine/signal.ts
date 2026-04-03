/**
 * src/core/engine/signal.ts
 *
 * The Sensing Substrate.
 * Converts raw external inputs into calibrated, bias-aware, 
 * and precision-weighted 'Inference Atoms'.
 */

import { 
  DimensionDescriptor, 
  MIN_PRECISION, 
  precisionToVariance, 
  varianceToPrecision 
} from './manifold';

/** -------------------------
 * Type Definitions
 * ------------------------- */

export type SourceKind = 'human' | 'instrument' | 'synthetic';
export type TrustMode = 'learned' | 'fixed' | 'hybrid';

/**
 * SOURCEPROFILE: The historical 'personality' and reliability of a data origin.
 */
export interface SourceProfile {
  id: string;
  label: string;
  kind: SourceKind;
  
  // Trust & Reliability
  credibility: number;       // Scalar [0.0, 1.0]
  sampleCount: number;       // Total observations processed (n)
  trustMode: TrustMode;
  
  // Calibration
  baselineBias: number;      // Permanent systematic offset
  reliabilityVariance: number; // Meta-uncertainty (added noise floor)
  
  lastUpdated: number;
  metadata?: Record<string, unknown>;
}

/**
 * SIGNAL: The raw information unit from the field.
 */
export interface Signal {
  dimensionId: string;
  sourceId: string;
  value: number;
  observedPrecision: number; // Hardware/Self-reported precision (ω_obs)
  
  timestamp: number;
  units?: string;
  localBias?: number;        // Transient/contextual bias
  context?: Record<string, unknown>;
}

/**
 * PREPARED SIGNAL: The 'Inference Atom'.
 * Fully calibrated and weighted, ready for manifold fusion.
 */
export interface PreparedSignal {
  dimensionId: string;
  sourceId: string;
  
  adjustedValue: number;      // Value after bias correction and mapping
  effectivePrecision: number; // Precision after trust-based variance inflation
  sourceCredibilityUsed: number; // Snapshot of trust at time of preparation
  
  timestamp: number;
  originalSignal: Signal;
}

/** -------------------------
 * Pipeline Logic
 * ------------------------- */

/**
 * Adjusts the raw value based on source-level baseline bias 
 * and signal-level transient bias.
 */
export function applyBiasCorrection(signal: Signal, profile: SourceProfile): number {
  const totalBias = profile.baselineBias + (signal.localBias ?? 0);
  return signal.value - totalBias;
}

/**
 * Maps a corrected value into the manifold's coordinate space.
 * v1 is an identity transform. Future logic for unit scaling (e.g., C to K) 
 * belongs here.
 */
export function mapToManifoldSpace(
  value: number, 
  _descriptor: DimensionDescriptor
): number {
  return value;
}

/**
 * Calculates Effective Precision (ω_eff) via Variance Inflation.
 * Formula: σ_eff² = σ_obs² + Penalty(credibility, n, reliabilityVariance)
 */
export function calculateEffectivePrecision(
  signal: Signal, 
  profile: SourceProfile
): number {
  // Ensure observed precision is at least at the floor before conversion
  const safeObservedPrecision = Math.max(signal.observedPrecision, MIN_PRECISION);
  const observedVariance = precisionToVariance(safeObservedPrecision);
  
  const lambda = 2.0; 
  const n = profile.sampleCount;
  const c = Math.max(0, Math.min(1, profile.credibility)); // Clamp [0,1]

  /**
   * Variance Inflation Penalty:
   * Combines credibility, sample size, and the source's own reliability variance.
   */
  const trustPenalty = lambda * (1 - c) * (1 + 1 / (n + 1));
  const effectiveVariance = observedVariance + trustPenalty + profile.reliabilityVariance;
  
  return varianceToPrecision(effectiveVariance);
}

/**
 * Orchestrates the full sensing pipeline.
 */
export function prepareSignal(
  signal: Signal, 
  profile: SourceProfile, 
  descriptor: DimensionDescriptor
): PreparedSignal {
  // Guard: Integrity checks
  if (signal.sourceId !== profile.id) {
    throw new Error(`Signal/Profile mismatch: ${signal.sourceId} !== ${profile.id}`);
  }
  if (signal.dimensionId !== descriptor.id) {
    throw new Error(`Signal/Dimension mismatch: ${signal.dimensionId} !== ${descriptor.id}`);
  }

  const biasedValue = applyBiasCorrection(signal, profile);
  const adjustedValue = mapToManifoldSpace(biasedValue, descriptor);
  const effectivePrecision = calculateEffectivePrecision(signal, profile);

  return {
    dimensionId: signal.dimensionId,
    sourceId: signal.sourceId,
    adjustedValue,
    effectivePrecision,
    sourceCredibilityUsed: profile.credibility,
    timestamp: signal.timestamp,
    originalSignal: signal
  };
}


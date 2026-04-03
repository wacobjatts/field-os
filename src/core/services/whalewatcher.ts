/**
 * FILE: src/core/services/WhaleWatcher.ts
 * LAYER: Specialist Branch / Sensory Organ
 * ROLE: Measures thermodynamic market work to distinguish sponsored moves from ghosts.
 * * * CONSTITUTIONAL ALIGNMENT:
 * 1. Type-only integration with Trunk (signal.ts).
 * 2. Specialist-only logic: No trust mutation or belief updates.
 * 3. Evidence-bound: Derives effectivePrecision from displacement-work physics.
 * 4. Uncertainty-honest: Uses epsilon floors and explicit bounding.
 */

import type { PreparedSignal, Signal } from '../engine/signal';

/**
 * Observed market evidence required for WhaleWatcher analysis.
 */
export interface WhaleWatcherEvidence {
  dimensionId: string;
  price: number;
  priceChangeFraction: number; // dV: Relative price displacement
  orderBookDepth: number;      // W: Work required to move the boundary
}

/**
 * Tunable parameters for calibrating the physics curve.
 */
export interface WhaleWatcherConfig {
  regimeWorkScale: number;     // Baseline work for the current liquidity regime
  skepticism: number;          // Nonlinear exponent for ghost rejection (p)
  maxPrecision: number;        // The maximum authority ceiling for this specialist
}

export class WhaleWatcher {
  /**
   * The unique identifier for this specialist within the SourceRegistry.
   */
  public static readonly SOURCE_ID = 'specialist_whale_watcher';

  /**
   * Physical Constants for the specialist.
   */
  private static readonly DISPLACEMENT_EPSILON = 1e-8;

  /**
   * Translates raw market displacement and work into a Trunk-coherent PreparedSignal.
   * * * PHYSICS MAPPING:
   * 1. displacement (dV) = max(|priceChangeFraction|, DISPLACEMENT_EPSILON)
   * 2. workDone (W) = max(orderBookDepth, 0)
   * 3. resistanceDensity (rho) = W / dV
   * 4. inertia = rho / regimeWorkScale
   * 5. confidence = 1 - exp(-inertia)
   * 6. effectivePrecision = 1 + (confidence^skepticism * maxPrecision)
   */
  public static analyze(
    evidence: WhaleWatcherEvidence,
    config: WhaleWatcherConfig = { regimeWorkScale: 1000000, skepticism: 2, maxPrecision: 99 }
  ): PreparedSignal {
    const { dimensionId, price, priceChangeFraction, orderBookDepth } = evidence;

    // 1. Guard Config Values (Defensive Clamping)
    const safeRegimeWorkScale = Math.max(config.regimeWorkScale, 1);
    const safeSkepticism = Math.max(config.skepticism, 0.1);
    const safeMaxPrecision = Math.max(config.maxPrecision, 1);

    // 2. Continuous Displacement Handling (Epsilon Floor)
    // Prevents division-by-zero/discontinuity while remaining tunable.
    const displacement = Math.max(Math.abs(priceChangeFraction), WhaleWatcher.DISPLACEMENT_EPSILON);
    
    // 3. Work Done (W) - Guarded against negative/corrupt evidence
    const workDone = Math.max(orderBookDepth, 0);

    // 4. Resistance Density (rho = W / dV)
    const resistanceDensity = workDone / displacement;

    // 5. Normalized Inertia
    const inertia = resistanceDensity / safeRegimeWorkScale;

    // 6. Confidence Mapping (0 to 1)
    // Exponential saturation: higher inertia = higher physical certainty.
    const confidence = 1 - Math.exp(-inertia);

    // 7. Effective Precision & Bounding
    // Nonlinearly punishes low-confidence moves. 
    // Logic: Base floor (1) + specialist authority ceiling.
    const rawPrecision = 1 + Math.pow(confidence, safeSkepticism) * safeMaxPrecision;
    const effectivePrecision = Math.min(rawPrecision, 1 + safeMaxPrecision);

    // 8. Heuristic Ghost Flag
    // Simulation/Audit aid: High displacement with low physical inertia.
    const isGhostCandidate = displacement > 0.02 && confidence < 0.15;

    const timestamp = Date.now();
    
    // 9. Construct Trunk-Coherent Signal
    const originalSignal: Signal = {
      dimensionId,
      sourceId: WhaleWatcher.SOURCE_ID,
      value: price,
      observedPrecision: effectivePrecision,
      timestamp,
      units: 'USD',
      context: {
        physics: {
          workDone,
          displacement,
          resistanceDensity,
          inertia,
          confidence,
          isGhostCandidate // heuristic only
        },
        regime: {
          regimeWorkScale: safeRegimeWorkScale,
          skepticism: safeSkepticism,
          maxPrecision: safeMaxPrecision
        }
      }
    };

    return {
      dimensionId,
      sourceId: WhaleWatcher.SOURCE_ID,
      adjustedValue: price,
      effectivePrecision,
      sourceCredibilityUsed: 1.0, // Trust weight managed by Tenzo
      timestamp,
      originalSignal
    };
  }
}


/**
 * src/branch/kinetic/precision/tensionprecision.ts
 *
 * KINETIC PRECISION (13): CORE TENSION
 * Derives reliability from the combined honesty of mismatch and absorption.
 *
 * Neutrality rules:
 * - no arbitrary confidence boosts
 * - no directional bias
 * - strictly derived from input integrity
 */

const MIN_BRANCH_PRECISION = 1e-12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateTensionPrecision(
  mismatchPrecision: number,
  absorptionPrecision: number
): number {
  const safeMismatch = clamp01(mismatchPrecision);
  const safeAbsorption = clamp01(absorptionPrecision);

  const combinedPrecision = safeMismatch * safeAbsorption;

  return Math.max(MIN_BRANCH_PRECISION, clamp01(combinedPrecision));
}
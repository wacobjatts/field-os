/**
 * KINETIC MEASUREMENT INSTRUMENT
 * TYPE: Tension (Potential Energy / Trapped Pressure)
 * DOMAIN: Structural Physics
 * * Measures the internal pressure of the market by calculating the ratio
 * between Trapped Pressure (Force * Resistance) and the system's Release Capacity.
 */

/**
 * Pure mathematical helper to bound values between 0 and 1.
 * Localized to ensure instrument is self-contained.
 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * RAW TENSION MEASUREMENT
 * Extracted from src/branch/kinetic/tension.ts
 * * Logic:
 * 1. Pressure = Absolute Mismatch (Directional Force)
 * 2. Resistance = Absorption (Efficiency of the move)
 * 3. Trapped Pressure = Pressure * Resistance
 * 4. Release Capacity = 1 - Resistance
 * 5. Tension = Trapped Pressure / (Trapped Pressure + Release Capacity)
 */
export function measureTension(
  mismatch: number,
  absorption: number
): number {
  if (!Number.isFinite(mismatch) || !Number.isFinite(absorption)) {
    return 0;
  }

  // 1. Determine the raw directional pressure
  const pressure = Math.abs(mismatch);
  
  // 2. Determine the resistance (clamped to unit interval)
  const resistance = clamp01(absorption);

  // 3. Safety Check: If no force or no resistance, there is no tension
  if (pressure <= 0 || resistance <= 0) {
    return 0;
  }

  // 4. Calculate the state of the "Spring"
  const trappedPressure = pressure * resistance;
  const releaseCapacity = 1 - resistance;

  // 5. Calculate the Tension Ratio
  const denominator = trappedPressure + releaseCapacity;

  if (denominator <= 0) {
    return 0;
  }

  const tension = trappedPressure / denominator;

  // 6. Return clamped result [0, 1]
  return clamp01(tension);
}


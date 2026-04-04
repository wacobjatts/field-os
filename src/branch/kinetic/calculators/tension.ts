function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateTension(
  mismatch: number,
  absorption: number
): number {
  const pressure = Math.abs(mismatch);
  const resistance = clamp01(absorption);

  if (pressure <= 0 || resistance <= 0) {
    return 0;
  }

  const trappedPressure = pressure * resistance;
  const releaseCapacity = 1 - resistance;

  const denominator = trappedPressure + releaseCapacity;

  if (denominator <= 0) {
    return 0;
  }

  const tension = trappedPressure / denominator;

  return clamp01(tension);
}
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function calculateLiarIndex(
  realityGap: number,
  displacement: number
): number {
  const gap = Math.max(0, realityGap);
  const move = Math.max(0, displacement);

  if (move <= 0) {
    return 0;
  }

  const liarIndex = gap / move;

  return clamp01(liarIndex);
}
export function createSnapshotLabel(base: string) {
  return `${base} - ${new Date().toISOString()}`;
}

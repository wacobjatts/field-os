/**
 * src/branch/kinetic/dimensions.ts
 *
 * Canonical dimension registry for the Kinetic branch.
 * Keep keys and ids stable for engine compatibility.
 * Labels may evolve for UI/display naming.
 */

export const KINETIC_DIMENSIONS = {
  absorption: {
    id: 'absorption',
    label: 'Absorption',
    unit: 'ratio'
  },
  mismatch: {
    id: 'mismatch',
    label: 'Stress Field',
    unit: 'ratio'
  },
  realityGap: {
    id: 'realityGap',
    label: 'Reality Gap',
    unit: 'price'
  },
  tension: {
    id: 'tension',
    label: 'Tension',
    unit: 'ratio'
  },
  liarIndex: {
    id: 'liarIndex',
    label: 'Displacement Field',
    unit: 'ratio'
  },
  entropy: {
    id: 'entropy',
    label: 'Entropy',
    unit: 'ratio'
  }
} as const;

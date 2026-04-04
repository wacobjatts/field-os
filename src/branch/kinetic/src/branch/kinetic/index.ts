/**
 * src/branch/kinetic/index.ts
 *
 * Public export surface for the Kinetic branch.
 * This makes the entire module portable and easy to integrate.
 */

// --- core branch structure ---
export * from './types';
export * from './errors';
export * from './dimensions';
export * from './translator';
export * from './orchestrator';
export * from './history';

// --- calculators ---
export * from './calculators/absorption';
export * from './calculators/mismatch';
export * from './calculators/realitygap';
export * from './calculators/tension';
export * from './calculators/liarindex';
export * from './calculators/entropy';

// --- precision ---
export * from './precision/absorptionprecision';
export * from './precision/mismatchprecision';
export * from './precision/realitygapprecision';
export * from './precision/tensionprecision';
export * from './precision/liarindexprecision';
export * from './precision/entropyprecision';

// --- normalization ---
export * from './normalization/normalize';

// --- recorder ---
export * from './recorder';
export * from './recordblackhole';
export * from './runrecorder';

// --- stress test ---
export * from './stresstest/blackhole';
export * from './stresstest/runblackhole';
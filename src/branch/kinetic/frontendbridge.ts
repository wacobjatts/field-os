// kinetic/frontendbridge.ts
// Exposes Kinetic functions to the browser UI

import { computeKinetics } from './computekinetics';
import { buildKineticUIModel } from './uimodel';

declare global {
  interface Window {
    computeKinetics: typeof computeKinetics;
    buildKineticUIModel: typeof buildKineticUIModel;
  }
}

if (typeof window !== 'undefined') {
  window.computeKinetics = computeKinetics;
  window.buildKineticUIModel = buildKineticUIModel;
}

export {};

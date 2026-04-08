// kinetic/frontendbridge.ts
// Exposes Kinetic functions to the browser UI and orchestrates the live compute loop

import { computeKinetics, ComputeKineticsInput } from './computekinetics';
import { buildKineticUIModel } from './uimodel';

declare global {
  interface Window {
    computeKinetics: typeof computeKinetics;
    buildKineticUIModel: typeof buildKineticUIModel;
    startKineticLoop: (symbol: string) => void;
  }
}

/**
 * KineticLoop
 * A high-frequency loop that simulates/handles incoming engine snapshots,
 * processes them through the Kinetic pipeline, and notifies the UI.
 */
class KineticLoop {
  private activeSymbol: string = 'AAPL';
  private frameId: number | null = null;
  private lastMid: number = 150.0;

  constructor() {}

  public start(symbol: string) {
    this.activeSymbol = symbol;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.loop();
  }

  private loop = () => {
    // 1. Mock Snapshot Generation (In production, this comes from the Engine Socket)
    const currentMid = this.lastMid + (Math.random() - 0.5) * 0.1;
    const input: ComputeKineticsInput = {
      snapshot: {
        bids: [[currentMid - 0.01, 100]],
        asks: [[currentMid + 0.01, 100]],
        timestamp: Date.now()
      },
      previousMid: this.lastMid,
      anchorMid: 150.0,
      source: {
        id: 'primary-feed',
        weight: 1.0,
        latency: 15
      },
      previousDecayEvents: [] 
    };

    // 2. Compute Kinetics
    const output = computeKinetics(input);

    // 3. Build UI Model
    const uiModel = buildKineticUIModel(this.activeSymbol, output);

    // 4. Dispatch Browser Event
    const event = new CustomEvent('kinetic-model-update', {
      detail: uiModel
    });
    window.dispatchEvent(event);

    // Update state for next tick
    this.lastMid = currentMid;
    this.frameId = requestAnimationFrame(this.loop);
  };
}

if (typeof window !== 'undefined') {
  const engine = new KineticLoop();

  window.computeKinetics = computeKinetics;
  window.buildKineticUIModel = buildKineticUIModel;
  
  // Expose start trigger to the environment
  window.startKineticLoop = (symbol: string) => engine.start(symbol);

  // Auto-start for the FieldOS environment
  setTimeout(() => {
    window.startKineticLoop('AAPL');
  }, 1000);
}

export {};

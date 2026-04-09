// src/branch/kinetic/frontendbridge.ts
import { computeKinetics, ComputeKineticsInput } from './computekinetics';
import { buildKineticUIModel } from './uimodel';

declare global {
  interface Window {
    computeKinetics: typeof computeKinetics;
    buildKineticUIModel: typeof buildKineticUIModel;
    startKineticLoop: (symbol: string) => void;
  }
}

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
    const currentMid = this.lastMid + (Math.random() - 0.5) * 0.1;
    
    const input: ComputeKineticsInput = {
      snapshot: {
        book: {
          bids: [{ price: currentMid - 0.01, size: 100 }],
          asks: [{ price: currentMid + 0.01, size: 100 }],
          bestBid: currentMid - 0.01,
          bestAsk: currentMid + 0.01,
          bestBidSize: 100,
          bestAskSize: 100,
          lastUpdateId: 0,
          lastServerTime: Date.now(),
          localUpdateTime: Date.now(),
          isSynced: true,
        },
        trades: {
          trades: [],
          buyWork: 0,
          sellWork: 0,
          totalBuyVolume: 0,
          totalSellVolume: 0,
          tradeCount: 0,
          vwap: currentMid,
          volatility: 0,
        },
        timestamp: Date.now()
      },
      previousMid: this.lastMid,
      anchorMid: 150.0,
      source: { 
        id: 'primary-feed',
        label: 'Primary Feed',
        kind: 'synthetic',
        credibility: 1.0,
        sampleCount: 1,
        weight: 1.0,
        latency: 0,
        isAggregated: false,
        tags: []
      },
      previousDecayEvents: [] 
    };

    const output = computeKinetics(input);
    const uiModel = buildKineticUIModel(this.activeSymbol, output);

    window.dispatchEvent(new CustomEvent('kinetic-model-update', { detail: uiModel }));

    this.lastMid = currentMid;
    this.frameId = requestAnimationFrame(this.loop);
  };
}

if (typeof window !== 'undefined') {
  const engine = new KineticLoop();
  window.computeKinetics = computeKinetics;
  window.buildKineticUIModel = buildKineticUIModel;
  window.startKineticLoop = (symbol: string) => engine.start(symbol);
  setTimeout(() => window.startKineticLoop('AAPL'), 1000);
}

export {};

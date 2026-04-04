/**
 * FILE: src/components/SimulationSuite.tsx
 * LAYER: Diagnostic / Behavioral Validation
 * ROLE: Behavioral validator for WhaleWatcher using the Authoritative Trunk Contract.
 * * TYPE SAFETY & CONTRACT LOCK:
 * 1. DimensionDescriptor: Uses kind: 'observed' per trunk semantics.
 * 2. Context Access: Uses 'as' casting to bridge Record<string, unknown> to WhaleWatcher physics.
 * 3. StrategicUtility: command: 'GATHER' is now strictly bound.
 */

import React, { useState } from 'react';
import { tenzo } from '../core/engine/tenzo';
import { WhaleWatcher } from '../core/services/WhaleWatcher';
// Authoritative Imports
import type { SystemState } from '../core/engine/tenzo';
import type { PreparedSignal } from '../core/engine/signal';

const DIM_ID = "truth_01";
const SOURCE_ID = "specialist_whale_watcher";

/** * Local interface for UI casting to ensure the compiler understands 
 * the 'unknown' Record contains our specific market physics.
 */
interface WhaleWatcherPhysicsContext {
  displacement: number;
  workDone: number;
  resistanceDensity: number;
  inertia: number;
  confidence: number;
  isGhostCandidate: boolean;
}

const SCENARIOS = {
  GHOST_SPIKE: { label: "Ghost Spike", dV: 0.08, work: 5000, desc: "High displacement (+8%), low work. Testing rejection." },
  INSTITUTIONAL: { label: "Institutional", dV: 0.02, work: 5000000, desc: "Moderate move (+2%), massive work. Testing heavy sponsorship." },
  PROTO_ABSORPTION: { label: "Proto-Absorption", dV: 0.001, work: 2000000, desc: "Minimal move, high work. Testing resistance density." },
  NORMAL: { label: "Normal Flow", dV: 0.005, work: 100000, desc: "Balanced market efficiency." }
};

export const SimulationSuite = () => {
  // 1. INITIALIZE TRUNK-BINDING SYSTEM STATE (Strict Semantic Lock)
  const [state, setState] = useState<SystemState>({
    manifold: {
      id: "manifold_alpha",
      label: "Primary Market Manifold",
      topology: {
        [DIM_ID]: { 
          id: DIM_ID, 
          kind: "observed", // Corrected from 'currency' to Trunk-aligned kind
          units: "USD", 
          tags: ["core", "market"] 
        } 
      },
      beliefs: { 
        [DIM_ID]: { mean: 100.00, precision: 10.0, lastUpdated: Date.now() } 
      }
    },
    sources: {
      [SOURCE_ID]: {
        id: SOURCE_ID,
        label: "Whale Watcher Alpha",
        kind: 'instrument', 
        credibility: 0.90,
        sampleCount: 0,
        trustMode: 'learned',
        baselineBias: 0,
        reliabilityVariance: 0.1,
        lastUpdated: Date.now()
      }
    },
    lastAssessment: {
      command: "GATHER", 
      urgency: 0.1,
      resourceAllocation: 1.0,
      systemStress: 0.05,
      totalEntropy: 1.2,
      totalSurprise: 0,
      confidence: 0.95
    },
    latestResults: [],
    timestamp: Date.now()
  });

  const [activeSignal, setActiveSignal] = useState<PreparedSignal | null>(null);

  // 2. THE INJECTION LOOP
  const runSimulation = (key: keyof typeof SCENARIOS) => {
    const s = SCENARIOS[key];
    const currentMean = state.manifold.beliefs[DIM_ID].mean;
    const injectedPrice = currentMean * (1 + s.dV);

    const signal = WhaleWatcher.analyze({
      dimensionId: DIM_ID,
      price: injectedPrice,
      priceChangeFraction: s.dV,
      orderBookDepth: s.work
    });

    const nextState = Tenzo.facilitate(state, [signal], Date.now());
    
    setActiveSignal(signal);
    setState(nextState);
  };

  const currentPrice = state.manifold.beliefs[DIM_ID].mean;
  const rejectionGap = activeSignal ? activeSignal.adjustedValue - currentPrice : 0;

  // Type-Safe Context Extraction
  const physics = activeSignal?.originalSignal.context?.physics as WhaleWatcherPhysicsContext | undefined;

  return (
    <div className="p-6 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 font-mono text-xs max-w-2xl mx-auto shadow-2xl">
      <header className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-indigo-400 font-bold tracking-tight uppercase">WhaleWatcher Behavioral Validator</h2>
        <div className="bg-slate-900/50 text-slate-400 px-2 py-1 rounded border border-slate-700/50 text-[9px]">TRUNK-BINDING SIMULATION</div>
      </header>
      
      {/* Simulation Controls */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button 
            key={key}
            onClick={() => runSimulation(key as any)}
            className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 text-left rounded transition-all group"
          >
            <div className="text-indigo-300 font-bold group-hover:text-indigo-200">{s.label}</div>
            <div className="opacity-50 mt-1 leading-relaxed text-[10px]">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* State Readouts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-black/40 rounded border border-slate-900">
          <div className="text-slate-500 mb-1 uppercase text-[9px] tracking-wider text-center">mean (Ground State)</div>
          <div className="text-xl text-emerald-400 font-bold text-center">${currentPrice.toFixed(4)}</div>
        </div>
        <div className="p-4 bg-black/40 rounded border border-slate-900">
          <div className="text-slate-500 mb-1 uppercase text-[9px] tracking-wider text-center">credibility (WhaleWatcher)</div>
          <div className="text-xl text-blue-400 font-bold text-center">
            {(state.sources[SOURCE_ID].credibility * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Physics Audit & Rejection Visualization */}
      {activeSignal && physics && (
        <div className="bg-slate-900/60 p-4 rounded border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 italic">adjustedValue (Claimed):</span>
              <span className="font-semibold text-slate-300">${activeSignal.adjustedValue.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 italic">rejectionGap (System Buffer):</span>
              <span className={`font-bold ${Math.abs(rejectionGap) > 0.01 ? 'text-amber-500' : 'text-slate-400'}`}>
                {rejectionGap.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-3 text-center">Market Physics Context Audit</h4>
            <div className="grid grid-cols-2 gap-y-3 text-[10px]">
              <span className="text-slate-500">displacement (dV):</span>
              <span className="text-right text-slate-300">{physics.displacement.toFixed(6)}</span>

              <span className="text-slate-500">workDone (∫p dV):</span>
              <span className="text-right text-slate-300">{physics.workDone.toLocaleString()}</span>
              
              <span className="text-slate-500">resistanceDensity:</span>
              <span className="text-right text-slate-300">{physics.resistanceDensity.toFixed(2)}</span>

              <span className="text-slate-500">inertia (normalized):</span>
              <span className="text-right text-slate-300">{physics.inertia.toFixed(6)}</span>
              
              <span className="text-slate-500">confidence score:</span>
              <span className="text-right text-slate-300">{physics.confidence.toFixed(4)}</span>

              <span className="text-slate-500 font-bold">effectivePrecision:</span>
              <span className="text-right text-blue-400 font-bold">{activeSignal.effectivePrecision.toFixed(2)}</span>
            </div>
          </div>
          
          {physics.isGhostCandidate && (
            <div className="mt-4 p-2 bg-red-950/30 border border-red-900/50 text-red-500 text-center text-[9px] font-bold tracking-widest animate-pulse uppercase">
              Physics Violation: Ghost Candidate
            </div>
          )}
        </div>
      )}
    </div>
  );
};

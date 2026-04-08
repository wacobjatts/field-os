'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import '../branch/kinetic/frontendbridge';

// --- RENDERER IMPORTS (SOURCE OF TRUTH) ---
import { paintTensionField } from '../branch/kinetic/renderer/tension-field-painter';
import { paintRealityGapField } from '../branch/kinetic/renderer/reality-gap-painter';
import { paintKineticAnchor } from '../branch/kinetic/renderer/kinetic-anchor-painter';
import { paintDecayOscillator } from '../branch/kinetic/renderer/decay-oscillator-painter';
import { paintCompressionSpark } from '../branch/kinetic/renderer/compression-spark-painter';
import { paintDisplacementField } from '../branch/kinetic/renderer/displacement-field-painter';
import { paintStressField } from '../branch/kinetic/renderer/stress-field-painter';
import { paintTransmissionField } from '../branch/kinetic/renderer/transmission-field-painter';
import { paintAbsorptionField } from '../branch/kinetic/renderer/absorption-field-painter';
import { paintDecayDivergenceField } from '../branch/kinetic/renderer/decay-divergence-painter';
import { paintTensionPoints } from '../branch/kinetic/renderer/tension-points-painter';

// --- RENDERER MAP ---
const RENDERER_MAP: Record<string, Function> = {
  'absorption-tension': paintTensionField,
  'reality-gap': paintRealityGapField,
  'kinetic-anchor': paintKineticAnchor,
  'decay-oscillator': paintDecayOscillator,
  'compression-spark': paintCompressionSpark,
  'displacement-field': paintDisplacementField,
  'stress-field': paintStressField,
  'transmission-field': paintTransmissionField,
  'absorption-field': paintAbsorptionField,
  'decay-divergence': paintDecayDivergenceField,
  'tension-points': paintTensionPoints,
  /**
   * NOTE: tension-line mapping
   * This is a temporary visual reuse. tension-line is intentionally sharing the 
   * same base signal family (Tension Points) for now. No separate paintTensionLine 
   * integration is wired in this file yet.
   */
  'tension-line': paintTensionPoints,
};

// --- COMPONENTS ---

/**
 * InstrumentCanvas
 * Bridge between React lifecycle and the low-level painter functions.
 */
const InstrumentCanvas = ({ rendererKey, data }: { rendererKey: string; data: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. DPR-safe canvas drawing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect() || { width: 300, height: 100 };
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // 2. Data shape extraction
    const payload = data?.field || data?.events || data;

    // 3. Dispatch to painter
    const painter = RENDERER_MAP[rendererKey];
    if (painter && payload) {
      painter(ctx, payload);
    }
  }, [rendererKey, data]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '100%', display: 'block' }} 
    />
  );
};

export default function KineticPage() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomMenuVisible, setBottomMenuVisible] = useState(true);
  const [kineticUI, setKineticUI] = useState<any>(null);

  useEffect(() => {
    // 2. Event listener name check
    const handleModelUpdate = (e: any) => {
      setKineticUI(e.detail);
    };
    window.addEventListener('kinetic-model-update', handleModelUpdate);
    return () => window.removeEventListener('kinetic-model-update', handleModelUpdate);
  }, []);

  const toggleLeft = () => setLeftCollapsed(!leftCollapsed);
  const toggleRight = () => setRightCollapsed(!rightCollapsed);
  const toggleMenu = (show: boolean) => setBottomMenuVisible(show);

  return (
    <div className="app-shell">
      <div className="workspace-shell">
        
        {/* LEFT CURTAIN */}
        <aside className={`curtain left-curtain ${leftCollapsed ? 'is-collapsed' : ''}`}>
          <div className="curtain-content">
            <div className="panel-header">
              <span className="panel-title">Watchlists</span>
              <button className="icon-btn">+</button>
            </div>
            <input type="text" className="ticker-search" placeholder="Find symbol..." />
          </div>
          <button className="curtain-handle" onClick={toggleLeft}>
            {leftCollapsed ? '›' : '‹'}
          </button>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="center-workspace">
          <section className="chart-box">
            <div id="chartContainer" style={{ width: '100%', height: '100%' }}></div>
          </section>

          <div className="middle-stack" id="middleStack">
            {/* 3. Safe fallback state */}
            {kineticUI?.stack && kineticUI.stack.length > 0 ? (
              kineticUI.stack.map((item: any) => (
                <section key={item.key} className="stack-card">
                  <div className="card-header">
                    <h3 className="card-title">{item.title}</h3>
                    <span className="card-category">{item.category}</span>
                  </div>
                  <div className="card-visual-area">
                    <InstrumentCanvas rendererKey={item.rendererKey} data={item.data} />
                  </div>
                  <div className="card-readout">
                    <div className="readout-item"><span className="readout-label">SIG</span><span id={`val-${item.key}-1`}>0</span></div>
                    <div className="readout-item"><span className="readout-label">DYN</span><span id={`val-${item.key}-2`}>—</span></div>
                  </div>
                </section>
              ))
            ) : (
              <section className="stack-card">
                <div className="card-header">
                  <h3 className="card-title">Awaiting Kinetic Data</h3>
                  <span className="card-category">System</span>
                </div>
                <div className="card-visual-area" style={{ opacity: 0.1 }}></div>
              </section>
            )}
          </div>

          <section className="instrument-chooser-area">
            <button className="ghost-btn" style={{ margin: '20px auto', display: 'block', padding: '10px 20px' }}>
              + Add Tool
            </button>
          </section>
        </main>

        {/* RIGHT CURTAIN */}
        <aside className={`curtain right-curtain ${rightCollapsed ? 'is-collapsed' : ''}`}>
          <button className="curtain-handle" onClick={toggleRight}>
            {rightCollapsed ? '‹' : '›'}
          </button>
          <div className="curtain-content">
            <div className="panel-header">
              <span className="panel-title">Info</span>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM MENU */}
      <footer className={`bottom-menu-wrap ${!bottomMenuVisible ? 'is-hidden' : ''}`}>
        <button className="menu-item">Volume</button>
        <button className="menu-item">Chart</button>
        <button className="menu-item">Instr</button>
        <button className="menu-item">Book</button>
        <button className="menu-item">Sig</button>
        <button className="menu-item">News</button>
        <button className="menu-item" style={{ color: '#666' }} onClick={() => toggleMenu(false)}>⌄</button>
      </footer>

      {!bottomMenuVisible && (
        <button className="reopen-menu" onClick={() => toggleMenu(true)}>OPEN MENU</button>
      )}

      {/* STYLES PRESERVED FROM index.html */}
      <style jsx global>{`
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000000; color: #e8e8e8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .app-shell { position: fixed; inset: 0; display: grid; grid-template-rows: 1fr auto; padding: env(safe-area-inset-top) 10px env(safe-area-inset-bottom) 10px; }
        .workspace-shell { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; min-height: 0; overflow: hidden; }

        .curtain { height: 100%; overflow: hidden; transition: width 0.2s ease; display: flex; }
        .left-curtain { width: 130px; }
        .right-curtain { width: 120px; }
        .curtain.is-collapsed { width: 20px !important; }

        .curtain-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 8px; background: #050505; }
        .curtain.is-collapsed .curtain-content { display: none; }
        .curtain-handle { width: 20px; background: #0a0a0a; color: #e8e8e8; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: none; }

        .center-workspace { display: flex; flex-direction: column; overflow-y: auto; gap: 6px; scrollbar-width: none; }
        .center-workspace::-webkit-scrollbar { display: none; }
        
        .chart-box { position: sticky; top: 0; z-index: 20; background: #000; width: 100%; aspect-ratio: 1.1 / 1; border: none; display: flex; align-items: center; justify-content: center; font-weight: bold; }

        .middle-stack { display: flex; flex-direction: column; gap: 6px; }
        
        .stack-card { border: none; background: #000; display: flex; flex-direction: column; border-bottom: 1px solid #111; }
        .card-header { padding: 8px 6px; display: flex; justify-content: space-between; align-items: center; background: #000; }
        .card-title { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0; color: #ccc; }
        .card-category { font-size: 9px; color: #444; text-transform: uppercase; }
        
        .card-visual-area { background: #050505; height: 100px; width: 100%; position: relative; overflow: hidden; }
        .card-readout { display: flex; gap: 12px; padding: 4px 6px; background: #000; border-top: 1px solid #0a0a0a; }
        .readout-item { font-size: 10px; font-family: monospace; color: #00ffff; }
        .readout-label { color: #444; margin-right: 4px; }

        .bottom-menu-wrap { border: none; height: 54px; display: grid; grid-template-columns: repeat(6, 1fr) 40px; background: #000; }
        .menu-item { background: transparent; border: none; color: #fff; font-size: 8px; text-transform: uppercase; cursor: pointer; }
        .reopen-menu { position: fixed; bottom: 10px; right: 10px; background: #000; border: none; color: #fff; padding: 6px 10px; font-size: 10px; z-index: 100; border-radius: 2px; }
        .is-hidden { display: none !important; }

        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .panel-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #666; margin: 0; }
        .ticker-search { width: 100%; background: #111; border: none; color: #fff; padding: 6px; margin-bottom: 10px; font-size: 11px; outline: none; }
        .ghost-btn { background: #0a0a0a; border: none; color: #fff; padding: 4px 8px; font-size: 10px; cursor: pointer; }
        .icon-btn { background: transparent; border: none; color: #fff; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}

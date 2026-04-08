'use client';

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import '../branch/kinetic/frontendbridge';

// --- RENDERER IMPORTS ---
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

// --- TYPES & DISPATCH ---
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
  // Note: paintTensionLine does not exist as a separate file in the current renderer stack.
  // We use paintTensionPoints for both keys as per current engineering internal state.
  'tension-line': paintTensionPoints,
  'decay-divergence': paintDecayDivergenceField,
  'tension-points': paintTensionPoints,
};

// --- COMPONENTS ---

/**
 * InstrumentCanvas
 * Small React wrapper to bridge data to the real painter functions
 */
const InstrumentCanvas = ({ rendererKey, data }: { rendererKey: string; data: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle DPR
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Dispatch
    const painter = RENDERER_MAP[rendererKey];
    if (painter && data) {
      // Data extraction: painters expect the point array (field) or event array (events)
      const payload = data.field || data.events || data;
      painter(ctx, payload);
    } else {
      // Fallback visual
      ctx.strokeStyle = '#222';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(10, 10, rect.width - 20, rect.height - 20);
    }
  }, [rendererKey, data]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '100%', display: 'block' }} 
    />
  );
};

function generateWavePath(freq: number, amp: number) {
  let path = '';
  for (let x = 0; x <= 100; x += 2) {
    const y =
      50 +
      Math.sin((x / 100) * Math.PI * 2 * freq + Date.now() / 500) *
        (amp * 30);

    path += x === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return path;
}

export default function KineticPage() {
  // --- STATE ---
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomMenuVisible, setBottomMenuVisible] = useState(true);
  const [activeList, setActiveList] = useState('Main');
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [chooserOpen, setChooserOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [modulePickerOpen, setModulePickerOpen] = useState(false);
  const [rightModules, setRightModules] = useState<string[]>([]);
  const [kineticUI, setKineticUI] = useState<any>(null);
  const [stackItems, setStackItems] = useState([
    { id: 'instr-initial', type: 'instrument', name: 'Kinetic Manifold', category: 'General' },
  ]);

  // --- EFFECT: DATA LOOP ---
  useEffect(() => {
    const handleModelUpdate = (e: any) => {
      setKineticUI(e.detail);
    };
    window.addEventListener('kinetic-model-update', handleModelUpdate);
    return () => window.removeEventListener('kinetic-model-update', handleModelUpdate);
  }, []);

  // --- HANDLERS ---
  const toggleLeft = () => setLeftCollapsed(!leftCollapsed);
  const toggleRight = () => setRightCollapsed(!rightCollapsed);
  const toggleMenu = () => setBottomMenuVisible(!bottomMenuVisible);

  return (
    <main style={styles.appShell}>
      {/* WORKSPACE AREA */}
      <div style={styles.workspaceShell}>
        {/* LEFT CURTAIN */}
        <aside style={{ ...styles.curtain, ...styles.leftCurtain, width: leftCollapsed ? '0px' : '130px' }}>
          <div style={styles.curtainHeader}>
            <span>WATCHLIST</span>
            <button style={styles.iconBtn} onClick={toggleLeft}>×</button>
          </div>
          <div style={styles.watchlistScroll}>
            {['AAPL', 'BTC', 'ETH', 'TSLA', 'NVDA', 'SOL'].map((s) => (
              <div
                key={s}
                style={{ ...styles.watchItem, color: activeTicker === s ? '#00fbff' : '#ccc' }}
                onClick={() => setActiveTicker(s)}
              >
                {s}
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER STACK (SCROLLABLE) */}
        <section style={styles.mainContainer}>
          <div style={styles.chartArea}>
            <div style={styles.chartHeader}>
              <span style={{ color: '#00fbff' }}>{activeTicker}</span> / FIELD KINETICS
            </div>
            <div id="chartContainer" style={styles.chartPlaceholder}>
              <div style={{ color: '#333', fontSize: '10px' }}>MAIN CHART SURFACE</div>
            </div>
          </div>

          <div id="middleStack" style={styles.scrollStack}>
            {kineticUI?.stack ? (
              kineticUI.stack.map((item: any) => (
                <div key={item.key} style={styles.instrumentCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>{item.title}</span>
                    <span style={styles.cardCategory}>{item.category}</span>
                  </div>
                  <div style={styles.cardVisual}>
                    <InstrumentCanvas rendererKey={item.rendererKey} data={item.data} />
                  </div>
                </div>
              ))
            ) : (
              stackItems.map((item) => (
                <div key={item.id} style={styles.instrumentCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>{item.name}</span>
                    <span style={styles.cardCategory}>{item.category}</span>
                  </div>
                  <div style={styles.cardVisual}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={generateWavePath(2, 0.5)}
                        fill="none"
                        stroke="rgba(0, 251, 255, 0.3)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RIGHT CURTAIN */}
        <aside style={{ ...styles.curtain, ...styles.rightCurtain, width: rightCollapsed ? '0px' : '120px' }}>
          <div style={styles.curtainHeader}>
            <button style={styles.iconBtn} onClick={toggleRight}>×</button>
            <span>DATA</span>
          </div>
          <div style={styles.dataGrid}>
            <div style={styles.dataLabel}>MID</div>
            <div style={styles.dataValue}>{kineticUI?.rightPanel?.raw?.mid?.toFixed(2) || '0.00'}</div>
            <div style={styles.dataLabel}>PREC</div>
            <div style={styles.dataValue}>{(kineticUI?.rightPanel?.precision * 100).toFixed(1)}%</div>
          </div>
        </aside>
      </div>

      {/* BOTTOM MENU AREA */}
      {bottomMenuVisible ? (
        <nav style={styles.bottomMenuWrap}>
          <button style={styles.menuItem} onClick={() => setActiveList('Main')}>Field</button>
          <button style={styles.menuItem} onClick={() => setActiveList('Tension')}>Tension</button>
          <button style={styles.menuItem} onClick={() => setActiveList('Absorption')}>Flow</button>
          <button style={styles.menuItem} onClick={() => setActiveList('Entropy')}>Entropy</button>
          <button style={styles.menuItem} onClick={() => setActiveList('System')}>System</button>
          <button style={styles.menuItem} onClick={() => setModulePickerOpen(true)}>Modules</button>
          <button style={{ ...styles.menuItem, background: '#111' }} onClick={toggleMenu}>▼</button>
        </nav>
      ) : (
        <button style={styles.reopenMenu} onClick={toggleMenu}>▲ MENU</button>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appShell: { position: 'fixed', inset: 0, display: 'grid', gridTemplateRows: '1fr auto', padding: '0 10px', background: '#000', color: '#e8e8e8', fontFamily: 'monospace', overflow: 'hidden' },
  workspaceShell: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px', minHeight: 0, overflow: 'hidden' },
  curtain: { height: '100%', overflow: 'hidden', transition: 'width 0.2s ease', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #111', borderRight: '1px solid #111', background: '#050505' },
  curtainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', borderBottom: '1px solid #111', color: '#666' },
  iconBtn: { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' },
  watchlistScroll: { flex: 1, overflowY: 'auto', padding: '4px' },
  watchItem: { padding: '8px', fontSize: '11px', cursor: 'pointer', borderBottom: '1px solid #0a0a0a' },
  mainContainer: { display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' },
  chartArea: { height: '35vh', borderBottom: '1px solid #111', display: 'flex', flexDirection: 'column' },
  chartHeader: { padding: '6px', fontSize: '10px', fontWeight: 'bold' },
  chartPlaceholder: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030303' },
  scrollStack: { flex: 1, overflowY: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px' },
  instrumentCard: { background: '#080808', border: '1px solid #111', borderRadius: '2px', display: 'flex', flexDirection: 'column', minHeight: '140px' },
  cardHeader: { padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #0f0f0f' },
  cardTitle: { fontSize: '10px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase' },
  cardCategory: { fontSize: '8px', color: '#444' },
  cardVisual: { flex: 1, position: 'relative', overflow: 'hidden' },
  dataGrid: { padding: '10px', display: 'grid', gridTemplateColumns: '1fr', gap: '4px' },
  dataLabel: { fontSize: '8px', color: '#444' },
  dataValue: { fontSize: '10px', color: '#ccc', marginBottom: '8px' },
  bottomMenuWrap: { height: '48px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) 40px', background: '#000', borderTop: '1px solid #111' },
  menuItem: { background: 'transparent', border: 'none', color: '#666', fontSize: '9px', textTransform: 'uppercase', cursor: 'pointer' },
  reopenMenu: { position: 'fixed', bottom: '10px', right: '10px', background: '#111', border: 'none', color: '#fff', padding: '6px 10px', fontSize: '10px', cursor: 'pointer' }
};


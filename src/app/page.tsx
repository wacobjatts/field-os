l'use client';

import React, { useState, useEffect } from 'react';

// --- THEME ENGINE (Electric Cyan & High-Contrast Black) ---
const THEME = {
  bg: '#00050a',           // True Black-Blue
  panel: 'rgba(10, 15, 25, 0.8)', 
  electricCyan: '#00ffff', // Neon Cyan
  neonYellow: '#ffff00',   // High-Visibility Yellow
  dangerRed: '#ff4d4d',    // Ask/Bid Stress
  grid: 'rgba(0, 255, 255, 0.05)',
  border: 'rgba(0, 255, 255, 0.2)',
};

export default function FieldOS_Unified() {
  const [trace, setTrace] = useState(62);
  const [pulse, setPulse] = useState(0);

  // Live "Kinetic" Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTrace(prev => Math.floor(Math.random() * (64 - 60 + 1) + 60));
      setPulse(p => (p + 1) % 100);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={s.page}>
      {/* BACKGROUND SCANNERS */}
      <div style={s.scanGrid} />
      
      {/* LEFT: TICKER HUD */}
      <aside style={s.leftPanel}>
        <div style={s.tag}>SYSTEM.INSTRUMENTS</div>
        <div style={s.searchField}>SCANNING_MARKET...</div>
        {['TSLA', 'NVDA', 'SPY', 'QQQ', 'BTC'].map((ticker) => (
          <div key={ticker} style={s.tickerItem}>
            {ticker} <span style={{fontSize: '9px', opacity: 0.5}}>ACTIVE</span>
          </div>
        ))}
      </aside>

      {/* CENTER: MAIN TACTICAL DISPLAY */}
      <section style={s.centerDisplay}>
        <div style={s.displayHeader}>
          <div style={{color: THEME.electricCyan, fontWeight: 900, letterSpacing: '2px'}}>
            BRANCH::KINETIC_TRACER [TSLA]
          </div>
          <div style={{color: THEME.neonYellow}}>5M_INTERVAL</div>
        </div>

        <div style={s.viewportContainer}>
          {/* 3D-STYLE CHART LAYER */}
          <div style={s.viewportGrid} />
          
          {/* SCALE NUMBERS */}
          <div style={{...s.scaleNum, top: '20%'}}>80</div>
          <div style={{...s.scaleNum, top: '50%'}}>50</div>
          <div style={{...s.scaleNum, top: '80%'}}>20</div>

          {/* THE ELECTRIC PATH */}
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" style={s.svgLayer}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              d={`M 0 200 C 150 ${180 + pulse/2}, 300 ${250 - pulse}, 500 200 C 700 150, 850 250, 1000 220`}
              fill="none"
              stroke={THEME.electricCyan}
              strokeWidth="3"
              filter="url(#glow)"
              style={{ transition: 'd 0.8s ease-in-out' }}
            />
          </svg>

          {/* REAL-TIME DATA BADGE */}
          <div style={s.dataBadge}>
            <div style={{fontSize: '12px', color: THEME.electricCyan, opacity: 0.6}}>ABSORPTION_V1</div>
            {trace}
          </div>
        </div>

        {/* BOTTOM: SUB-INSTRUMENT STACK */}
        <div style={s.instrumentDock}>
          {['VOLUME', 'DECAY', 'TENSION', 'SPARK'].map(name => (
            <div key={name} style={s.miniCard}>
              <div style={s.miniLabel}>{name}</div>
              <div style={{color: THEME.electricCyan, fontSize: '14px'}}>0.842</div>
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT: ORDER FLOW MEMORY */}
      <aside style={s.rightPanel}>
        <div style={s.tag}>ORDER_FLOW.L2</div>
        <div style={s.orderRow}><span style={{color: THEME.dangerRed}}>ASK</span> 248.22</div>
        <div style={s.orderRow}><span style={{color: THEME.dangerRed}}>ASK</span> 248.18</div>
        <div style={{height: '1px', background: THEME.border, margin: '10px 0'}} />
        <div style={s.orderRow}><span style={{color: '#00ff88'}}>BID</span> 248.10</div>
        <div style={s.orderRow}><span style={{color: '#00ff88'}}>BID</span> 248.06</div>
      </aside>
    </main>
  );
}

// --- CSS-IN-JS ENGINE ---
const s: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: THEME.bg,
    color: '#d7e6ff',
    height: '100vh',
    width: '100vw',
    display: 'grid',
    gridTemplateColumns: '200px 1fr 220px',
    fontFamily: '"Courier New", monospace',
    overflow: 'hidden',
  },
  scanGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(${THEME.grid} 1px, transparent 1px), linear-gradient(90deg, ${THEME.grid} 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  leftPanel: {
    background: THEME.panel,
    borderRight: `1px solid ${THEME.border}`,
    padding: '15px',
    zIndex: 10,
  },
  rightPanel: {
    background: THEME.panel,
    borderLeft: `1px solid ${THEME.border}`,
    padding: '15px',
    zIndex: 10,
  },
  centerDisplay: {
    display: 'grid',
    gridTemplateRows: '50px 1fr 120px',
    padding: '10px',
  },
  displayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 15px',
    borderBottom: `1px solid ${THEME.border}`,
    fontSize: '12px',
  },
  viewportContainer: {
    position: 'relative',
    margin: '10px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: `1px solid ${THEME.border}`,
    borderRadius: '2px',
    overflow: 'hidden',
  },
  viewportGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px)`,
    backgroundSize: '100px 100px',
  },
  svgLayer: { width: '100%', height: '100%', position: 'absolute', top: 0 },
  dataBadge: {
    position: 'absolute',
    top: '20px',
    right: '25px',
    fontSize: '48px',
    fontWeight: 900,
    color: THEME.neonYellow,
    textShadow: `0 0 15px ${THEME.neonYellow}`,
    textAlign: 'right',
  },
  scaleNum: { position: 'absolute', left: '10px', fontSize: '10px', color: THEME.electricCyan, opacity: 0.4 },
  instrumentDock: { display: 'flex', gap: '10px', padding: '10px' },
  miniCard: {
    flex: 1,
    background: 'rgba(0, 255, 255, 0.05)',
    border: `1px solid ${THEME.border}`,
    padding: '12px',
    textAlign: 'center',
  },
  miniLabel: { fontSize: '9px', color: THEME.electricCyan, opacity: 0.6, marginBottom: '4px' },
  tag: { fontSize: '10px', color: THEME.electricCyan, marginBottom: '15px', fontWeight: 'bold' },
  searchField: { 
    border: `1px solid ${THEME.border}`, 
    padding: '8px', 
    fontSize: '10px', 
    marginBottom: '20px',
    color: THEME.electricCyan,
  },
  tickerItem: {
    padding: '12px',
    border: `1px solid ${THEME.border}`,
    marginBottom: '8px',
    fontSize: '13px',
    color: THEME.electricCyan,
    textShadow: '0 0 5px rgba(0,255,255,0.5)',
    display: 'flex',
    justifyContent: 'space-between',
  },
  orderRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '6px 0' },
};

'use client'; // CRITICAL: Tells the browser to run the JavaScript

import React, { useState, useEffect } from 'react';

// --- THEME CONSTANTS (Electric Space Aesthetic) ---
const COLORS = {
  bg: '#05070a',           // Deep Space Black
  panel: '#0a0e14',        // Industrial Hull
  border: 'rgba(0, 255, 255, 0.15)', // Faint Cyan Glow
  electricCyan: '#00ffff', // The "Neon" Primary
  neonYellow: '#ffd84d',   // High-Precision Accents
  text: '#d7e6ff',         // Soft HUD Blue
};

export default function FieldOS() {
  const [value, setValue] = useState(62);

  // Simulated Live Data Trace
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => Math.floor(Math.random() * (65 - 58 + 1) + 58));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={s.page}>
      {/* 1. BACKGROUND GRID SYSTEM */}
      <div style={s.gridOverlay} />

      {/* 2. LEFT PANEL: TICKERS */}
      <aside style={s.sidePanel}>
        <div style={s.label}>system.tickers</div>
        <div style={s.searchBox}>search_instrument...</div>
        {['tsla', 'nvda', 'spy', 'qqq'].map(ticker => (
          <div key={ticker} style={s.listItem}>{ticker}</div>
        ))}
      </aside>

      {/* 3. CENTER PANEL: MAIN HUD */}
      <section style={s.centerSection}>
        <header style={s.header}>
          <span style={{ color: COLORS.electricCyan, fontWeight: 800 }}>TSLA // KINETIC.BRANCH</span>
          <span style={{ color: COLORS.neonYellow }}>5M_TIMEFRAME</span>
        </header>

        <div style={s.chartContainer}>
          {/* THE 3D INDICATOR / CHART */}
          <div style={s.innerGrid} />
          
          <div style={s.priceLabel}>80</div>
          <div style={s.priceLabelMid}>50</div>
          <div style={s.priceLabelLow}>20</div>

          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" style={s.svg}>
            {/* The "Electric" Glow Path */}
            <path
              d="M 0 200 C 150 180, 300 300, 500 200 C 700 100, 850 250, 1000 220"
              fill="none"
              stroke={COLORS.electricCyan}
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 12px #00ffff)' }} 
            />
          </svg>

          <div style={s.glowBadge}>{value}</div>
        </div>

        {/* BOTTOM INSTRUMENT STACK */}
        <div style={s.bottomDock}>
          {['absorption', 'volume', 'transmission', 'decay'].map(inst => (
            <div key={inst} style={s.instrumentCard}>
              <div style={{fontSize: '10px', opacity: 0.5}}>inst_type</div>
              {inst}
            </div>
          ))}
        </div>
      </section>

      {/* 4. RIGHT PANEL: ORDER FLOW */}
      <aside style={s.sidePanelRight}>
        <div style={s.label}>ask_bid.memory</div>
        <div style={s.orderRow}><span style={{color: '#ff4d4d'}}>ASK</span> 248.22</div>
        <div style={s.orderRow}><span style={{color: '#ff4d4d'}}>ASK</span> 248.18</div>
        <div style={{height: '2px', background: COLORS.border, margin: '5px 0'}} />
        <div style={s.orderRow}><span style={{color: '#4dff88'}}>BID</span> 248.10</div>
        <div style={s.orderRow}><span style={{color: '#4dff88'}}>BID</span> 248.06</div>
      </aside>
    </main>
  );
}

// --- HUD STYLING ENGINE ---
const s: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '220px 1fr 240px',
    fontFamily: 'monospace',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(${COLORS.border} 1px, transparent 1px)`,
    backgroundSize: '30px 30px',
    pointerEvents: 'none',
  },
  sidePanel: {
    background: COLORS.panel,
    borderRight: `1px solid ${COLORS.border}`,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 10,
  },
  sidePanelRight: {
    background: COLORS.panel,
    borderLeft: `1px solid ${COLORS.border}`,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 10,
  },
  centerSection: {
    display: 'grid',
    gridTemplateRows: '60px 1fr 140px',
    padding: '10px',
    zIndex: 5,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  chartContainer: {
    position: 'relative',
    margin: '15px',
    background: '#040608',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  innerGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
  },
  svg: { width: '100%', height: '100%', position: 'absolute' },
  glowBadge: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '42px',
    fontWeight: 900,
    color: COLORS.neonYellow,
    textShadow: `0 0 15px ${COLORS.neonYellow}`,
  },
  bottomDock: { display: 'flex', gap: '12px', padding: '10px' },
  instrumentCard: {
    flex: 1,
    background: 'rgba(10, 14, 20, 0.8)',
    border: `1px solid ${COLORS.border}`,
    padding: '15px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    color: COLORS.electricCyan,
  },
  label: { fontSize: '10px', color: COLORS.electricCyan, marginBottom: '10px', opacity: 0.7 },
  searchBox: { border: `1px solid ${COLORS.border}`, padding: '8px', fontSize: '12px', marginBottom: '10px' },
  listItem: { padding: '8px', border: `1px solid rgba(255,255,255,0.05)`, marginBottom: '5px', fontSize: '13px' },
  orderRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px' },
  priceLabel: { position: 'absolute', left: '10px', top: '20%', fontSize: '10px', opacity: 0.5 },
  priceLabelMid: { position: 'absolute', left: '10px', top: '50%', fontSize: '10px', opacity: 0.5 },
  priceLabelLow: { position: 'absolute', left: '10px', top: '80%', fontSize: '10px', opacity: 0.5 },
};

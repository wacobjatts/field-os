'use client';

import React, { useEffect, useState } from 'react';
import '../branch/kinetic/frontendbridge';

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

declare global {
  interface Window {
    computeKinetics: any;
    buildKineticUIModel: any;
  }
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
    { id: 'instr-initial', type: 'instrument', name: 'Kinetic Manifold', desc: 'Combines force and truth into a single live view.', collapsed: false }
  ]);

  // --- DATA ---
  const watchlists: Record<string, [string, string, string][]> = {
    'Main': [['AAPL', '214.43', '+1.2%'], ['NVDA', '132.17', '-0.5%'], ['TSLA', '176.80', '+2.4%']],
    'Tech': [['MSFT', '420.10', '+0.8%'], ['GOOGL', '180.20', '+0.3%']],
    'Alts': [['BTC', '64,231', '-1.1%'], ['ETH', '3,450', '+0.9%']]
  };

  const categories = [
    { name: '1. Structural Field', items: [['Phase Boundaries', 'Architectural thresholds.'], ['Compression Zones', 'Market squeezing.']] },
    { name: '2. Force Field', items: [['Momentum Vector', 'Directional force.'], ['Acceleration Gradient', 'Speed change.']] },
    { name: '3. Resistance Field', items: [['Cost-to-Move Curve', 'Friction vs liquidity.'], ['Liquidity Density', 'Order book pockets.']] },
    { name: '4. Inertia Field', items: [['Move Inertia', 'Difficulty of stopping.'], ['Mass Class', 'Move classification.']] },
    { name: '5. Interpretation Field', items: [['Truth Field', 'Signal vs Noise.'], ['Confidence Metrics', 'System conviction.']] },
    { name: '6. Decision Field', items: [['Alignment Score', 'System aggregate.'], ['Entry Readiness', 'Action state.']] }
  ];

  // --- ENGINE BRIDGE ---
  useEffect(() => {
    if (typeof window !== 'undefined' && window.computeKinetics && window.buildKineticUIModel) {
      const base = 100 + Math.random() * 20;

      const snapshot = {
        book: {
          bestBid: base,
          bestAsk: base + Math.random() * 2,
          bestBidSize: Math.random() * 200 + 10,
          bestAskSize: Math.random() * 200 + 10,
          localUpdateTime: Date.now(),
        },
        trades: {
          tradeCount: Math.floor(Math.random() * 50),
        },
        timestamp: Date.now(),
      };

      const result = window.computeKinetics({
        snapshot,
        previousMid: 100,
        anchorMid: 100,
        source: {
          name: activeTicker,
          reliability: 1,
        },
        previousDecayEvents: [],
      });

      const ui = window.buildKineticUIModel(activeTicker, result);
      setKineticUI(ui ?? null);
    }
  }, [activeTicker]);

  // --- HANDLERS ---
  const addModuleToStack = (type: string, name: string, desc: string) => {
    if (type === 'volume' && stackItems.some(i => i.type === 'volume')) return;
    setStackItems(prev => [...prev, { 
      id: type === 'volume' ? 'vol-01' : Date.now().toString(), 
      type, name, desc, collapsed: false 
    }]);
    setChooserOpen(false);
  };

  const moveItem = (index: number, dir: number) => {
    const newItems = [...stackItems];
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    const [removed] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, removed);
    setStackItems(newItems);
  };

  const removeItem = (index: number) => {
    setStackItems(prev => prev.filter((_, i) => i !== index));
  };

  const toggleVolumeCollapse = (index: number) => {
    const newItems = [...stackItems];
    newItems[index].collapsed = !newItems[index].collapsed;
    setStackItems(newItems);
  };

  const toggleVolumeCollapseAll = () => {
    setStackItems(prev => prev.map(item => 
      item.type === 'volume' ? { ...item, collapsed: !item.collapsed } : item
    ));
  };

  const addRightModule = (type: string) => {
    setRightModules(prev => [...prev, type]);
    setModulePickerOpen(false);
  };

  const removeRightModule = (index: number) => {
    setRightModules(prev => prev.filter((_, i) => i !== index));
  };

  // --- RENDER HELPERS ---
  const isVolumeActive = stackItems.some(i => i.type === 'volume');

  return (
    <div className="app-shell" style={styles.appShell}>
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      
      <div className="workspace-shell" style={styles.workspaceShell}>
        
        {/* LEFT CURTAIN */}
        <aside className={`curtain left-curtain ${leftCollapsed ? 'is-collapsed' : ''}`} style={styles.curtainLeft}>
          <div className="curtain-content" style={styles.curtainContent}>
            <div className="panel-header" style={styles.panelHeader}>
              <span className="panel-title" style={styles.panelTitle}>Watchlists</span>
              <button className="icon-btn" style={styles.iconBtn}>+</button>
            </div>
            <div className="list-selector" style={styles.listSelector}>
              {['Main', 'Tech', 'Alts'].map(name => (
                <button 
                  key={name}
                  className={`list-tab ${activeList === name ? 'is-active' : ''}`} 
                  style={{...styles.listTab, ...(activeList === name ? styles.listTabActive : {})}}
                  onClick={() => setActiveList(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <input type="text" className="ticker-search" placeholder="Find symbol..." style={styles.tickerSearch} />
            <div className="ticker-list" style={styles.tickerList}>
              {watchlists[activeList].map((t) => (
                <div 
                  key={t[0]} 
                  className={`ticker-row ${activeTicker === t[0] ? 'is-active' : ''}`} 
                  style={{...styles.tickerRow, ...(activeTicker === t[0] ? styles.tickerRowActive : {})}}
                  onClick={() => setActiveTicker(t[0])}
                >
                  <span>{t[0]}</span>
                  <span className="t-price" style={styles.tPrice}>
                    {t[1]}
                    <span className="t-delta" style={styles.tDelta}>{t[2]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="curtain-handle" style={styles.curtainHandle} onClick={() => setLeftCollapsed(!leftCollapsed)}>
            {leftCollapsed ? '›' : '‹'}
          </button>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="center-workspace" style={styles.centerWorkspace}>
          <section className="chart-box" style={styles.chartBox}>
            <div id="chartContainer" style={{ width: '100%', height: '100%' }} />
          </section>

          <div
            style={{
              padding: '8px',
              fontSize: '11px',
              color: '#00ffff',
              background: '#050505',
            }}
          >
            ACTIVE TICKER: {activeTicker} | STACK: {Array.isArray(kineticUI?.stack) ? kineticUI.stack.length : 0}
          </div>

          <div className="middle-stack" style={styles.middleStack}>
            {Array.isArray(kineticUI?.stack) && kineticUI.stack.length > 0 ? (
              kineticUI.stack.map((item: any, idx: number) => (
                <section key={`engine-${idx}`} className="stack-card" style={styles.stackCard}>
                  <div style={{
                    height: '100px',
                    background: '#050505',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">

                      {/* Absorption (slow wave / macro field) */}
                      <path
                        d={generateWavePath(0.5, 0.8)}
                        stroke="#00ffff"
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.7"
                      />

                      {/* Compression (fast wave / micro pressure) */}
                      <path
                        d={generateWavePath(2, 0.4)}
                        stroke="#bf00ff"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.9"
                      />

                      {/* Midline */}
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#222" strokeWidth="0.5" />

                    </svg>
                  </div>
                  <div className="card-header" style={styles.cardHeader}>
                    <div className="card-info"><h3 className="card-title" style={styles.cardTitle}>{item.title}</h3></div>
                    <div className="card-controls" style={styles.cardControls}>
                      <button className="icon-btn" style={{...styles.iconBtn, color: '#666'}}>?</button>
                    </div>
                  </div>
                </section>
              ))
            ) : (
              stackItems.map((item, i) => {
                const isVol = item.type === 'volume';
                const isCollapsed = isVol && item.collapsed;
                return (
                  <section 
                    key={item.id} 
                    className={`stack-card ${isVol ? 'is-volume' : ''} ${isCollapsed ? 'is-collapsed' : ''}`} 
                    style={{...styles.stackCard, ...(isVol ? styles.stackCardVolume : {}), ...(isCollapsed ? styles.stackCardCollapsed : {})}}
                  >
                    {!isCollapsed && (
                      <div className="card-visual" style={isVol ? styles.volumeChart : styles.cardVisual}>
                        {isVol ? "[ VOLUME GRADIENT ]" : item.name}
                      </div>
                    )}
                    <div className="card-header" style={styles.cardHeader}>
                      <div className="card-info">
                        <h3 className="card-title" style={{...styles.cardTitle, ...(isVol ? styles.cardTitleVolume : {}), ...(isCollapsed ? styles.cardTitleCollapsed : {})}}>
                          {isVol ? `Volume: ${item.name}` : item.name}
                        </h3>
                      </div>
                      <div className="card-controls" style={styles.cardControls}>
                        {!isCollapsed && (
                          <>
                            <button className="icon-btn" style={styles.iconBtn} onClick={() => moveItem(i, -1)}>▲</button>
                            <button className="icon-btn" style={styles.iconBtn} onClick={() => moveItem(i, 1)}>▼</button>
                            <button className="icon-btn" style={{...styles.iconBtn, color: '#ff4444'}} onClick={() => removeItem(i)}>×</button>
                          </>
                        )}
                        {isVol && (
                          <button className="icon-btn" style={styles.iconBtn} onClick={() => toggleVolumeCollapse(i)}>
                            {isCollapsed ? '▸' : '▾'}
                          </button>
                        )}
                        {!isVol && <button className="icon-btn" style={{...styles.iconBtn, color: '#666'}}>?</button>}
                      </div>
                    </div>
                  </section>
                );
              })
            )}
          </div>

          <section className="instrument-chooser-area">
            {!chooserOpen ? (
              <button className="ghost-btn" style={styles.addInstrBtn} onClick={() => setChooserOpen(true)}>+ Add Tool</button>
            ) : (
              <div className="chooser-panel" style={styles.chooserPanel}>
                <div className="chooser-top-bar" style={styles.chooserTopBar}>
                  <span className="panel-title" style={{color:'#fff'}}>Tools</span>
                  <button className="ghost-btn" style={styles.ghostBtn} onClick={() => setChooserOpen(false)}>Hide</button>
                </div>
                
                <div className="chooser-section-label" style={styles.chooserSectionLabel}>Quick Access</div>
                <div className="quick-access-list" style={styles.quickAccessList}>
                  <button className="quick-btn" style={styles.quickBtn} disabled={isVolumeActive} onClick={() => addModuleToStack('volume', 'Relative Cloud', 'Deep structural volume analysis.')}>
                    {isVolumeActive ? "Volume Strip (Active)" : "Volume (Relative Cloud)"}
                  </button>
                  <button className="quick-btn" style={styles.quickBtn} onClick={() => addModuleToStack('instrument', 'Kinetic Manifold', 'Combines force and truth.')}>Kinetic Manifold</button>
                  <button className="quick-btn" style={styles.quickBtn} onClick={() => addModuleToStack('instrument', 'Compression / Expansion', 'Tracks breathing cycle.')}>Compression / Expansion</button>
                </div>

                <div className="chooser-section-label" style={styles.chooserSectionLabel}>Categories</div>
                <div id="categoryContainer">
                  {categories.map((cat, idx) => (
                    <div key={idx} className={`category-card ${expandedCategory === idx ? 'is-expanded' : ''}`} style={styles.categoryCard}>
                      <button className="category-head" style={styles.categoryHead} onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}>
                        <span>{cat.name}</span><span>▾</span>
                      </button>
                      {expandedCategory === idx && (
                        <div className="category-content" style={styles.categoryContentCol}>
                          {cat.items.map(i => (
                            <button key={i[0]} className="sub-item" style={styles.subItem} onClick={() => addModuleToStack('instrument', i[0], i[1])}>{i[0]}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          <div style={{minHeight: '20px'}}></div>
        </main>

        {/* RIGHT CURTAIN */}
        <aside className={`curtain right-curtain ${rightCollapsed ? 'is-collapsed' : ''}`} style={styles.curtainRight}>
          <button className="curtain-handle" style={styles.curtainHandle} onClick={() => setRightCollapsed(!rightCollapsed)}>
            {rightCollapsed ? '‹' : '›'}
          </button>
          <div className="curtain-content" style={styles.curtainContent}>
            <div className="panel-header" style={styles.panelHeader}>
              <span className="panel-title">Info</span>
              <button className="icon-btn" style={styles.iconBtn} onClick={() => setModulePickerOpen(!modulePickerOpen)}>+</button>
            </div>

            {modulePickerOpen && (
              <div className="module-picker-overlay" style={styles.modulePickerOverlay}>
                {['Order Book', 'Notes', 'Signals'].map(m => (
                  <button key={m} className="picker-btn" style={styles.pickerBtn} onClick={() => addRightModule(m)}>{m}</button>
                ))}
              </div>
            )}

            {rightModules.length === 0 ? (
              <div className="empty-state" style={styles.emptyState}>
                <span>Workspace Empty</span>
                <button className="ghost-btn" style={styles.ghostBtn} onClick={() => setModulePickerOpen(true)}>+ Add</button>
              </div>
            ) : (
              <div className="module-stack" style={{...styles.moduleStack, gridTemplateRows: `repeat(${rightModules.length}, minmax(0, 1fr))`}}>
                {rightModules.map((m, i) => (
                  <div key={i} className="module-card" style={styles.moduleCard}>
                    <div className="module-head" style={styles.moduleHead}>
                      <span>{m}</span>
                      <button className="icon-btn" style={{height:'auto', width:'auto', fontSize:'14px'}} onClick={() => removeRightModule(i)}>×</button>
                    </div>
                    <div style={{flex:1, padding:'8px', fontSize:'9px', color:'#666', overflow:'hidden'}}>
                      {m === 'Notes' ? (
                        <textarea style={{width:'100%', height:'100%', background:'transparent', color:'#fff', border:'none', outline:'none', resize:'none'}}></textarea>
                      ) : (
                        <pre style={{margin:0, whiteSpace:'pre-wrap', color: '#00ffff'}}>{kineticUI ? JSON.stringify(kineticUI.rightPanel || {}, null, 2) : 'Awaiting data...'}</pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {bottomMenuVisible ? (
        <footer className="bottom-menu-wrap" style={styles.bottomMenuWrap}>
          <button className="menu-item" style={styles.menuItem} onClick={toggleVolumeCollapseAll}>Volume</button>
          <button className="menu-item" style={styles.menuItem}>Chart</button>
          <button className="menu-item" style={styles.menuItem}>Instr</button>
          <button className="menu-item" style={styles.menuItem}>Book</button>
          <button className="menu-item" style={styles.menuItem}>Sig</button>
          <button className="menu-item" style={styles.menuItem}>News</button>
          <button className="menu-item" style={{...styles.menuItem, border:'none', color:'#666'}} onClick={() => setBottomMenuVisible(false)}>⌄</button>
        </footer>
      ) : (
        <button className="reopen-menu" style={styles.reopenMenu} onClick={() => setBottomMenuVisible(true)}>OPEN MENU</button>
      )}
    </div>
  );
}

// --- CSS CONSTANTS ---
const globalCSS = `
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #000000; color: #e8e8e8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  .curtain { transition: width 0.2s ease; }
  .is-collapsed { width: 20px !important; }
  .is-collapsed .curtain-content { display: none; }
  .is-active { color: #00ffff !important; }
  .ticker-row.is-active { background: #001515 !important; color: #00ffff !important; }
  .list-tab.is-active { color: #00ffff !important; }
`;

const styles: Record<string, React.CSSProperties> = {
  appShell: { position: 'fixed', inset: 0, display: 'grid', gridTemplateRows: '1fr auto', padding: 'env(safe-area-inset-top) 10px env(safe-area-inset-bottom) 10px' },
  workspaceShell: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px', minHeight: 0, overflow: 'hidden' },
  curtainLeft: { width: '130px', height: '100%', overflow: 'hidden', display: 'flex' },
  curtainRight: { width: '120px', height: '100%', overflow: 'hidden', display: 'flex' },
  curtainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '8px', background: '#050505' },
  curtainHandle: { width: '20px', background: '#0a0a0a', color: '#e8e8e8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: 'none' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  panelTitle: { fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', margin: 0 },
  listSelector: { display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '10px' },
  listTab: { background: 'transparent', border: 'none', color: '#666', fontSize: '9px', padding: '3px 6px', cursor: 'pointer', whiteSpace: 'nowrap' },
  listTabActive: { color: '#00ffff' },
  tickerSearch: { width: '100%', background: '#111', border: 'none', color: '#fff', padding: '6px', marginBottom: '10px', fontSize: '11px', outline: 'none' },
  tickerList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
  tickerRow: { display: 'grid', gridTemplateColumns: '1fr auto', padding: '6px', cursor: 'pointer', fontSize: '10px', background: '#0a0a0a' },
  tickerRowActive: { background: '#001515', color: '#00ffff' },
  tPrice: { color: '#00ff00', textAlign: 'right' },
  tDelta: { fontSize: '8px', color: '#666', display: 'block' },
  centerWorkspace: { display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '6px' },
  chartBox: { position: 'sticky', top: 0, zIndex: 20, background: '#000', width: '100%', aspectRatio: '1.1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  middleStack: { display: 'flex', flexDirection: 'column', gap: '6px' },
  stackCard: { border: 'none', background: '#000', display: 'flex', flexDirection: 'column' },
  stackCardVolume: { border: 'none' },
  stackCardCollapsed: { height: '20px', overflow: 'hidden', opacity: 0.7 },
  cardVisual: { minHeight: '90px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ffff', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', padding: '10px' },
  volumeChart: { width: '100%', height: '60px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ffff', fontSize: '10px' },
  cardHeader: { padding: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: '12px', fontWeight: 'bold', margin: 0, color: '#ccc' },
  cardTitleVolume: { fontSize: '11px', color: '#00ffff', textTransform: 'uppercase', letterSpacing: '1px' },
  cardTitleCollapsed: { fontSize: '9px', lineHeight: '18px' },
  cardControls: { display: 'flex', gap: '4px', alignItems: 'center' },
  addInstrBtn: { margin: '0 auto', display: 'block', padding: '10px 20px', background: '#0a0a0a', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer' },
  chooserPanel: { border: 'none', display: 'flex', flexDirection: 'column', background: '#050505' },
  chooserTopBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: '#111' },
  chooserSectionLabel: { fontSize: '9px', color: '#444', textTransform: 'uppercase', padding: '10px 10px 4px 10px', letterSpacing: '1px', fontWeight: 'bold' },
  quickAccessList: { padding: '4px 10px 10px 10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  quickBtn: { background: '#0a0a0a', border: 'none', color: '#ccc', padding: '10px', textAlign: 'left', cursor: 'pointer', fontSize: '11px' },
  categoryCard: { border: 'none', background: '#000' },
  categoryHead: { width: '100%', background: 'transparent', border: 'none', color: '#fff', padding: '10px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: '11px' },
  categoryContentCol: { display: 'flex', flexDirection: 'column', background: '#050505' },
  subItem: { padding: '10px', background: 'transparent', border: 'none', color: '#aaa', textAlign: 'left', fontSize: '10px', cursor: 'pointer' },
  moduleStack: { display: 'grid', gap: '8px', height: '100%' },
  moduleCard: { border: 'none', display: 'flex', flexDirection: 'column', minHeight: 0, background: '#0a0a0a' },
  moduleHead: { padding: '4px 8px', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', fontSize: '9px', fontWeight: 'bold' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px', color: '#444', fontSize: '10px' },
  modulePickerOverlay: { border: 'none', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', background: '#111', marginBottom: '10px' },
  pickerBtn: { background: '#000', border: 'none', color: '#ccc', fontSize: '9px', padding: '6px', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' },
  bottomMenuWrap: { border: 'none', height: '54px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr) 40px', background: '#000' },
  menuItem: { background: 'transparent', border: 'none', color: '#fff', fontSize: '8px', textTransform: 'uppercase', cursor: 'pointer' },
  reopenMenu: { position: 'fixed', bottom: '10px', right: '10px', background: '#000', border: 'none', color: '#fff', padding: '6px 10px', fontSize: '10px', zIndex: 100, borderRadius: '2px' },
  ghostBtn: { background: '#0a0a0a', border: 'none', color: '#fff', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' },
  iconBtn: { background: 'transparent', border: 'none', color: '#fff', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

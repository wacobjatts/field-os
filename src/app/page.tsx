export default function Page() {
  return (
    <main style={styles.page}>
      <div style={styles.grid} />

      <aside style={styles.leftPanel}>
        <div style={styles.panelTitle}>tickers</div>
        <div style={styles.searchBox}>search</div>
        <div style={styles.listItem}>tsla</div>
        <div style={styles.listItem}>nvda</div>
        <div style={styles.listItem}>spy</div>
        <div style={styles.listItem}>qqq</div>
      </aside>

      <section style={styles.centerPanel}>
        <div style={styles.chartHeader}>
          <span style={styles.symbol}>tsla</span>
          <span style={styles.timeframe}>5m</span>
        </div>

        <div style={styles.chartArea}>
          <div style={styles.chartGrid} />

          <div style={{ ...styles.hLine, top: '18%' }} />
          <div style={{ ...styles.hLine, top: '50%' }} />
          <div style={{ ...styles.hLine, top: '82%' }} />

          <div style={{ ...styles.sideNumber, top: '14%' }}>80</div>
          <div style={{ ...styles.sideNumber, top: '46%' }}>50</div>
          <div style={{ ...styles.sideNumber, top: '78%' }}>20</div>

          <svg viewBox="0 0 1000 420" preserveAspectRatio="none" style={styles.svg}>
            <path
              d="M 0 210
                 C 80 210, 120 260, 180 280
                 C 250 300, 320 250, 390 265
                 C 470 282, 540 330, 620 300
                 C 700 270, 760 190, 835 225
                 C 900 255, 955 240, 1000 230"
              fill="none"
              stroke="#1e7bff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <div style={styles.valueBadge}>62</div>
        </div>

        <div style={styles.bottomDock}>
          <div style={styles.instrumentCard}>absorption field</div>
          <div style={styles.instrumentCard}>volume</div>
          <div style={styles.instrumentCard}>transmission</div>
        </div>
      </section>

      <aside style={styles.rightPanel}>
        <div style={styles.panelTitle}>ask / bid</div>
        <div style={styles.bookRow}><span>ask</span><span>248.22</span></div>
        <div style={styles.bookRow}><span>ask</span><span>248.18</span></div>
        <div style={styles.bookRow}><span>bid</span><span>248.10</span></div>
        <div style={styles.bookRow}><span>bid</span><span>248.06</span></div>
      </aside>
    </main>
  );
}

const bg = '#05070a';
const panel = '#0a0e14';
const border = 'rgba(30,123,255,0.22)';
const blue = '#1e7bff';
const yellow = '#ffd84d';
const text = '#d7e6ff';
const subtle = 'rgba(215,230,255,0.08)';

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    background: bg,
    color: text,
    display: 'grid',
    gridTemplateColumns: '220px 1fr 260px',
    gridTemplateRows: '1fr',
    overflow: 'hidden',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },

  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },

  leftPanel: {
    position: 'relative',
    zIndex: 1,
    background: panel,
    borderRight: `1px solid ${border}`,
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  centerPanel: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateRows: '56px 1fr 140px',
    minWidth: 0,
  },

  rightPanel: {
    position: 'relative',
    zIndex: 1,
    background: panel,
    borderLeft: `1px solid ${border}`,
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 18px',
    borderBottom: `1px solid ${border}`,
    background: 'rgba(10,14,20,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  symbol: {
    color: blue,
    fontWeight: 700,
  },

  timeframe: {
    color: yellow,
    fontWeight: 700,
  },

  chartArea: {
    position: 'relative',
    margin: '14px',
    background: '#060a10',
    border: `1px solid ${border}`,
    borderRadius: '12px',
    overflow: 'hidden',
  },

  chartGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(${subtle} 1px, transparent 1px),
      linear-gradient(90deg, ${subtle} 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },

  hLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255,255,255,0.12)',
  },

  sideNumber: {
    position: 'absolute',
    left: '12px',
    color: yellow,
    fontSize: '12px',
    fontWeight: 700,
  },

  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },

  valueBadge: {
    position: 'absolute',
    right: '14px',
    top: '14px',
    color: yellow,
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },

  bottomDock: {
    display: 'flex',
    gap: '10px',
    padding: '0 14px 14px 14px',
    overflowX: 'auto',
  },

  instrumentCard: {
    minWidth: '180px',
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: '12px',
    padding: '14px',
    color: blue,
    textTransform: 'lowercase',
    fontWeight: 700,
  },

  panelTitle: {
    color: blue,
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },

  searchBox: {
    border: `1px solid ${border}`,
    background: '#060a10',
    borderRadius: '10px',
    padding: '10px 12px',
    color: 'rgba(215,230,255,0.55)',
    textTransform: 'lowercase',
  },

  listItem: {
    border: `1px solid ${border}`,
    background: '#060a10',
    borderRadius: '10px',
    padding: '10px 12px',
    color: text,
    textTransform: 'uppercase',
  },

  bookRow: {
    display: 'flex',
    justifyContent: 'space-between',
    border: `1px solid ${border}`,
    background: '#060a10',
    borderRadius: '10px',
    padding: '10px 12px',
    color: text,
    textTransform: 'uppercase',
    fontSize: '12px',
  },
};
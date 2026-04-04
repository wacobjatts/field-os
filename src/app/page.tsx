'use client';

import { useEffect, useState } from 'react';

interface LatestRecord {
  timestamp: number;
  symbol: string;
  midPrice: number;
  raw: {
    absorption: number;
    mismatch: number;
    realityGap: number;
    normalizedRealityGap: number;
    tension: number;
    liarIndex: number;
    entropy: number;
  };
  precision: {
    absorption: number;
    mismatch: number;
    realityGap: number;
    tension: number;
    liarIndex: number;
    entropy: number;
  };
}

interface ApiResponse {
  ok: boolean;
  latest: LatestRecord | null;
}

function formatValue(value: number | undefined, digits = 4): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--';
  return value.toFixed(digits);
}

function cardStyle(): React.CSSProperties {
  return {
    border: '1px solid #1e293b',
    borderRadius: 18,
    padding: 16,
    background: 'linear-gradient(180deg, rgba(8,22,43,0.96), rgba(4,12,25,0.96))',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 12px 30px rgba(0,0,0,0.26)'
  };
}

function row(label: string, value: string) {
  return (
    <div
      key={label}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function Page() {
  const [data, setData] = useState<LatestRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchLatest() {
    try {
      const response = await fetch('/api/kinetic/latest', { cache: 'no-store' });
      const json: ApiResponse = await response.json();

      if (json.ok) {
        setData(json.latest);
      }
    } catch (error) {
      console.error('Failed to fetch latest kinetic output:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatest();
    const timer = setInterval(fetchLatest, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(56,189,248,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(249,115,22,0.06), transparent 24%), #020617',
        color: '#e2e8f0',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '16px 14px 42px'
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 14 }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 700
            }}
          >
            FieldOS • Kinetic Monitor
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}
          >
            Live Kinetic Output
          </h1>

          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
            Real-time branch output from the recorder file.
          </p>
        </header>

        <section style={cardStyle()}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#94a3b8',
              fontWeight: 800,
              marginBottom: 14
            }}
          >
            System Overview
          </div>

          {loading ? (
            <div style={{ color: '#94a3b8' }}>Loading...</div>
          ) : !data ? (
            <div style={{ color: '#f59e0b' }}>
              No recorded data found yet. Start the engine runtime first.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12
                }}
              >
                <div style={cardStyle()}>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>Symbol</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{data.symbol}</div>
                </div>

                <div style={cardStyle()}>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>Mid Price</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>
                    {formatValue(data.midPrice, 4)}
                  </div>
                </div>

                <div style={cardStyle()}>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>Timestamp</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 12,
                  marginTop: 14
                }}
              >
                <div style={cardStyle()}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      fontWeight: 800,
                      marginBottom: 10
                    }}
                  >
                    Raw
                  </div>

                  {row('Absorption', formatValue(data.raw.absorption))}
                  {row('Mismatch', formatValue(data.raw.mismatch))}
                  {row('Reality Gap', formatValue(data.raw.realityGap))}
                  {row('Normalized Gap', formatValue(data.raw.normalizedRealityGap))}
                  {row('Tension', formatValue(data.raw.tension))}
                  {row('Liar Index', formatValue(data.raw.liarIndex))}
                  {row('Entropy', formatValue(data.raw.entropy))}
                </div>

                <div style={cardStyle()}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      fontWeight: 800,
                      marginBottom: 10
                    }}
                  >
                    Precision
                  </div>

                  {row('Absorption', formatValue(data.precision.absorption))}
                  {row('Mismatch', formatValue(data.precision.mismatch))}
                  {row('Reality Gap', formatValue(data.precision.realityGap))}
                  {row('Tension', formatValue(data.precision.tension))}
                  {row('Liar Index', formatValue(data.precision.liarIndex))}
                  {row('Entropy', formatValue(data.precision.entropy))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
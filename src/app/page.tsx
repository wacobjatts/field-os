'use client';

import { useEffect, useMemo, useState } from 'react';
import '../branch/kinetic/frontendbridge';

type StackItem = {
  key: string;
  title: string;
  family: string;
  data: any;
};

type DebugState = {
  bridgeLoaded: boolean;
  computeExists: boolean;
  uiModelExists: boolean;
  runOk: boolean;
  error: string | null;
};

declare global {
  interface Window {
    computeKinetics?: (input: any) => any;
    buildKineticUIModel?: (symbol: string, output: any) => any;
  }
}

export default function Page() {
  const [debug, setDebug] = useState<DebugState>({
    bridgeLoaded: false,
    computeExists: false,
    uiModelExists: false,
    runOk: false,
    error: null,
  });

  const [activeSymbol, setActiveSymbol] = useState('TEST');
  const [stack, setStack] = useState<StackItem[]>([]);
  const [selectedCardKey, setSelectedCardKey] = useState<string | null>(null);

  const watchlist = useMemo(
    () => [
      { symbol: 'TEST', price: '100.50', delta: '+0.8%' },
      { symbol: 'AAPL', price: '214.43', delta: '+1.2%' },
      { symbol: 'NVDA', price: '132.17', delta: '-0.5%' },
      { symbol: 'TSLA', price: '176.80', delta: '+2.4%' },
      { symbol: 'BTC', price: '64,231', delta: '-1.1%' },
    ],
    []
  );

  useEffect(() => {
    const nextDebug: DebugState = {
      bridgeLoaded: true,
      computeExists: typeof window.computeKinetics === 'function',
      uiModelExists: typeof window.buildKineticUIModel === 'function',
      runOk: false,
      error: null,
    };

    try {
      if (!nextDebug.computeExists) {
        throw new Error('window.computeKinetics is missing');
      }

      if (!nextDebug.uiModelExists) {
        throw new Error('window.buildKineticUIModel is missing');
      }

      const snapshot = {
        book: {
          bestBid: 100,
          bestAsk: 101,
          bestBidSize: 50,
          bestAskSize: 60,
          localUpdateTime: Date.now(),
        },
        trades: {
          tradeCount: 12,
        },
        timestamp: Date.now(),
      };

      const result = window.computeKinetics!({
        snapshot,
        previousMid: 100,
        anchorMid: 100,
        source: {
          name: 'demo',
          reliability: 1,
        },
        previousDecayEvents: [],
      });

      const ui = window.buildKineticUIModel!(activeSymbol, result);

      nextDebug.runOk = true;
      setStack(Array.isArray(ui?.stack) ? ui.stack : []);
      setSelectedCardKey((prev) =>
        prev && ui?.stack?.some((item: StackItem) => item.key === prev)
          ? prev
          : ui?.stack?.[0]?.key ?? null
      );
    } catch (err: any) {
      nextDebug.error = err?.message || String(err);
      setStack([]);
      setSelectedCardKey(null);
    }

    setDebug(nextDebug);
  }, [activeSymbol]);

  const selectedCard =
    stack.find((item) => item.key === selectedCardKey) ?? stack[0] ?? null;

  return (
    <main
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '12px',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 120px',
          gap: '12px',
          minHeight: 'calc(100vh - 24px)',
        }}
      >
        <aside
          style={{
            background: '#050505',
            border: '1px solid #111',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#666',
              fontWeight: 700,
            }}
          >
            Watchlist
          </div>

          <input
            value={activeSymbol}
            onChange={(e) => setActiveSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol"
            style={{
              width: '100%',
              background: '#111',
              color: '#fff',
              border: '1px solid #111',
              padding: '8px',
              fontSize: '12px',
              outline: 'none',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {watchlist.map((item) => (
              <button
                key={item.symbol}
                onClick={() => setActiveSymbol(item.symbol)}
                style={{
                  background:
                    activeSymbol === item.symbol ? '#001515' : '#0a0a0a',
                  color: activeSymbol === item.symbol ? '#00ffff' : '#ccc',
                  border: '1px solid #111',
                  padding: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                <div style={{ fontWeight: 700 }}>{item.symbol}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>{item.price}</div>
                <div
                  style={{
                    fontSize: '10px',
                    color: item.delta.startsWith('-') ? '#ff6b6b' : '#66ff99',
                  }}
                >
                  {item.delta}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: 0,
          }}
        >
          <section
            style={{
              background: '#050505',
              border: '1px solid #111',
              minHeight: '300px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  Kinetic
                </div>
                <h1
                  style={{
                    fontSize: '32px',
                    margin: 0,
                    color: '#fff',
                  }}
                >
                  {activeSymbol}
                </h1>
                <div style={{ color: '#00ffff', marginTop: '8px', fontSize: '14px' }}>
                  Engine-connected interface shell
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: '6px',
                  fontSize: '12px',
                  textAlign: 'right',
                }}
              >
                <div>Bridge: {debug.bridgeLoaded ? 'YES' : 'NO'}</div>
                <div>Compute: {debug.computeExists ? 'YES' : 'NO'}</div>
                <div>UI Model: {debug.uiModelExists ? 'YES' : 'NO'}</div>
                <div>Run: {debug.runOk ? 'YES' : 'NO'}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                border: '1px solid #111',
                background: '#000',
                minHeight: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ffff',
                fontSize: '22px',
                fontWeight: 700,
                textAlign: 'center',
                padding: '20px',
              }}
            >
              {selectedCard ? selectedCard.title : 'No instrument selected'}
            </div>
          </section>

          {debug.error && (
            <section
              style={{
                border: '1px solid #662222',
                background: '#1a0c0c',
                color: '#ff8a8a',
                padding: '12px',
                whiteSpace: 'pre-wrap',
              }}
            >
              Error: {debug.error}
            </section>
          )}

          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stack.map((item) => {
              const selected = item.key === (selectedCard?.key ?? null);

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedCardKey(item.key)}
                  style={{
                    background: '#050505',
                    border: selected ? '1px solid #00ffff' : '1px solid #111',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '6px',
                    }}
                  >
                    {item.family}
                  </div>
                  <div
                    style={{
                      color: '#00ffff',
                      fontSize: '20px',
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </div>
                </button>
              );
            })}

            {stack.length === 0 && !debug.error && (
              <div
                style={{
                  border: '1px solid #111',
                  background: '#050505',
                  padding: '14px',
                  color: '#888',
                }}
              >
                No instruments rendered yet.
              </div>
            )}
          </section>
        </section>

        <aside
          style={{
            background: '#050505',
            border: '1px solid #111',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#666',
              fontWeight: 700,
            }}
          >
            Info
          </div>

          <div
            style={{
              border: '1px solid #111',
              background: '#0a0a0a',
              padding: '10px',
              fontSize: '12px',
              color: '#ccc',
            }}
          >
            <div style={{ marginBottom: '6px', color: '#fff', fontWeight: 700 }}>
              Active Instrument
            </div>
            <div>{selectedCard ? selectedCard.title : 'None'}</div>
          </div>

          <div
            style={{
              border: '1px solid #111',
              background: '#0a0a0a',
              padding: '10px',
              fontSize: '11px',
              color: '#888',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
            }}
          >
            {selectedCard
              ? JSON.stringify(selectedCard.data, null, 2)
              : 'Select an instrument to inspect its output.'}
          </div>
        </aside>
      </div>
    </main>
  );
}

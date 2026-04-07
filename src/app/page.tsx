'use client';

import { useEffect, useState } from 'react';
import '../branch/kinetic/frontendbridge';

type StatusState = {
  bridgeLoaded: boolean;
  computeExists: boolean;
  uiModelExists: boolean;
  runOk: boolean;
  error: string | null;
  stack: string[];
};

declare global {
  interface Window {
    computeKinetics?: (input: any) => any;
    buildKineticUIModel?: (symbol: string, output: any) => any;
  }
}

export default function Page() {
  const [status, setStatus] = useState<StatusState>({
    bridgeLoaded: false,
    computeExists: false,
    uiModelExists: false,
    runOk: false,
    error: null,
    stack: [],
  });

  useEffect(() => {
    const nextState: StatusState = {
      bridgeLoaded: true,
      computeExists: typeof window.computeKinetics === 'function',
      uiModelExists: typeof window.buildKineticUIModel === 'function',
      runOk: false,
      error: null,
      stack: [],
    };

    try {
      if (!nextState.computeExists) {
        throw new Error('window.computeKinetics is missing');
      }

      if (!nextState.uiModelExists) {
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

      const ui = window.buildKineticUIModel!('TEST', result);

      nextState.runOk = true;
      nextState.stack = Array.isArray(ui?.stack)
        ? ui.stack.map((item: any) => item.title)
        : [];
    } catch (err: any) {
      nextState.error = err?.message || String(err);
    }

    setStatus(nextState);
  }, []);

  return (
    <main
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginTop: 0 }}>FieldOS Kinetic</h1>

      <div style={{ marginBottom: '20px', lineHeight: 1.8 }}>
        <div>Bridge loaded: {status.bridgeLoaded ? 'YES' : 'NO'}</div>
        <div>computeKinetics found: {status.computeExists ? 'YES' : 'NO'}</div>
        <div>buildKineticUIModel found: {status.uiModelExists ? 'YES' : 'NO'}</div>
        <div>Test run succeeded: {status.runOk ? 'YES' : 'NO'}</div>
      </div>

      {status.error && (
        <div
          style={{
            border: '1px solid #662222',
            background: '#1a0c0c',
            color: '#ff8a8a',
            padding: '12px',
            marginBottom: '20px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Error: {status.error}
        </div>
      )}

      <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>Instrument Stack</h2>

      {status.stack.length === 0 ? (
        <div
          style={{
            border: '1px solid #222',
            background: '#050505',
            padding: '14px',
            color: '#888',
          }}
        >
          No instruments rendered yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {status.stack.map((title, index) => (
            <div
              key={`${title}-${index}`}
              style={{
                border: '1px solid #111',
                background: '#050505',
                color: '#00ffff',
                padding: '14px',
                fontSize: '16px',
              }}
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

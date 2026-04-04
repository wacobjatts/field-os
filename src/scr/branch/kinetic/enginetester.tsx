/**
 * src/branch/kinetic/enginetester.tsx
 *
 * Simple browser-side tester for the Kinetic branch.
 * Lets you run the Black Hole stress test without a terminal.
 */

import React, { useMemo, useState } from 'react';
import { SourceProfile } from '../../core/engine/signal';
import { processSlice } from './orchestrator';
import { createBlackHoleSnapshot } from './stresstest/blackhole';

type TestResult = ReturnType<typeof processSlice> | null;

export default function EngineTester(): JSX.Element {
  const [result, setResult] = useState<TestResult>(null);

  const source: SourceProfile = useMemo(
    () => ({
      id: 'kinetic-sim',
      label: 'Kinetic Simulation Source',
      kind: 'synthetic',
      credibility: 1,
      sampleCount: 1000,
      trustMode: 'fixed',
      baselineBias: 0,
      reliabilityVariance: 0,
      lastUpdated: Date.now()
    }),
    []
  );

  function runBlackHole(): void {
    const { snapshot, previousMid, anchorMid } = createBlackHoleSnapshot();

    const output = processSlice({
      snapshot,
      previousMid,
      anchorMid,
      source
    });

    setResult(output);
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 16,
        color: '#e2e8f0',
        background: '#020617',
        minHeight: '100vh',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Kinetic Engine Tester</h1>
      <p style={{ color: '#94a3b8', marginTop: 0 }}>
        Browser-side test harness for Kinetic branch stress tests.
      </p>

      <button
        onClick={runBlackHole}
        style={{
          border: '1px solid #1e293b',
          background: '#07111f',
          color: '#e2e8f0',
          padding: '12px 16px',
          borderRadius: 12,
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        Run Black Hole Test
      </button>

      {result && (
        <div style={{ display: 'grid', gap: 16 }}>
          <section
            style={{
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 16,
              background: '#07111f'
            }}
          >
            <h2>Raw</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result.raw, null, 2)}
            </pre>
          </section>

          <section
            style={{
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 16,
              background: '#07111f'
            }}
          >
            <h2>Precision</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result.precision, null, 2)}
            </pre>
          </section>

          <section
            style={{
              border: '1px solid #1e293b',
              borderRadius: 16,
              padding: 16,
              background: '#07111f'
            }}
          >
            <h2>Signals</h2>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result.signals, null, 2)}
            </pre>
          </section>
        </div>
      )}
    </div>
  );
}
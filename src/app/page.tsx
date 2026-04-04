'use client';

import { useEffect, useState } from 'react';

interface KineticResult {
  raw: number;
  precision: number;
}

interface ApiResponse {
  ok: boolean;
  latest: {
    snapshot: {
      mid: number;
      timestamp: number;
    };
    result: KineticResult;
  } | null;
}

export default function Page() {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/kinetic/latest');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!data.latest) {
    return (
      <div style={{ padding: 20 }}>
        <h1>No Data Yet</h1>
        <p>Start your engine (run.ts)</p>
      </div>
    );
  }

  const { snapshot, result } = data.latest;

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 Kinetic Live Output</h1>

      <p><strong>Mid Price:</strong> {snapshot.mid.toFixed(4)}</p>
      <p><strong>Raw Signal:</strong> {result.raw.toFixed(4)}</p>
      <p><strong>Precision:</strong> {result.precision.toFixed(4)}</p>
      <p><strong>Timestamp:</strong> {new Date(snapshot.timestamp).toLocaleTimeString()}</p>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Tenzo } from '../engine/tenzo'; // UPDATED: Points to Tenzo now
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- THE DUAL HEMISPHERES (Plug your keys here later) ---
const supabaseA = createClient('URL_A', 'KEY_A'); 
const supabaseB = createClient('URL_B', 'KEY_B'); 

export default function SentinelTerminal() {
  const [state, setState] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isInjecting, setIsInjecting] = useState(false);

  // 1. Ignition: Initializing the Manifold
  useEffect(() => {
    const initialState = {
      manifold: { 
        beliefs: { 
          "truth_01": { mean: 100, precision: 10, lastUpdate: Date.now() } 
        } 
      },
      sources: { "narrator_01": { id: "narrator_01", credibility: 1.0 } },
      lastAssessment: { command: 'GATHER', systemStress: 0, confidence: 1.0 },
      latestResults: [],
      timestamp: Date.now()
    };
    setState(initialState);
  }, []);

  // 2. The Heartbeat Loop: Facilitating Truth via the Tenzo
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 4;
      const paradox = isInjecting ? (Math.random() - 0.5) * 60 : 0;
      const signalValue = 100 + noise + paradox;

      const signals = [{
        sourceId: "narrator_01",
        dimensionId: "truth_01",
        value: signalValue,
        precision: 15,
        timestamp: Date.now()
      }];

      // UPDATED: Calling the Tenzo instead of Governor
      const nextState = Tenzo.facilitate(state, signals, Date.now());
      
      setHistory(prev => [...prev.slice(-40), {
        time: new Date().toLocaleTimeString(),
        raw: signalValue,
        groundState: nextState.manifold.beliefs["truth_01"].mean,
        stress: nextState.lastAssessment.systemStress
      }]);

      setState(nextState);
    }, 250);
    return () => clearInterval(interval);
  }, [state, isInjecting]);

  if (!state) return <div style={{background:'#000', color:'#00d4ff', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>IGNITING FIELD-OS...</div>;

  return (
    <div style={{ padding: '30px', background: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
      {/* Header: The Sovereign Brand */}
      <div style={{ borderBottom: '1px solid #222', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, letterSpacing: '3px', color: '#00d4ff' }}>FIELD-OS // SENTINEL</h1>
          <p style={{ margin: 0, opacity: 0.4 }}>Dual-Hemisphere Data Integrity Engine</p>
        </div>
        <button 
          onMouseDown={() => setIsInjecting(true)} 
          onMouseUp={() => setIsInjecting(false)}
          style={{ 
            padding: '10px 25px', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
            background: isInjecting ? '#ff4d4d' : '#00d4ff', color: '#000', transition: '0.2s'
          }}
        >
          {isInjecting ? "ATTACK IN PROGRESS" : "INJECT MARKET PARADOX"}
        </button>
      </div>

      {/* Main Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '30px' }}>
        
        {/* Visual Manifold Graph */}
        <div style={{ background: '#0a0a0a', padding: '20px', border: '1px solid #111', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0, opacity: 0.6 }}>TRUTH STABILITY INDEX</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <Tooltip contentStyle={{background:'#000', border:'#222'}} />
                <Line type="monotone" dataKey="raw" stroke="#333" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="groundState" stroke="#00d4ff" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* The Sovereign Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0a0a0a', padding: '20px', border: '1px solid #111', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', opacity: 0.5 }}>SYSTEM STRESS (Γ)</h4>
            <div style={{ fontSize: '2.5rem', color: state.lastAssessment.systemStress > 5 ? '#ff4d4d' : '#00ffcc' }}>
              {state.lastAssessment.systemStress.toFixed(2)}
            </div>
          </div>
          
          <div style={{ background: '#0a0a0a', padding: '20px', border: '1px solid #111', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', opacity: 0.5 }}>SOURCE PERMEABILITY</h4>
            <div style={{ fontSize: '2.5rem', color: '#00d4ff' }}>
              {(state.sources["narrator_01"].credibility * 100).toFixed(1)}%
            </div>
          </div>

          <div style={{ background: '#0a0a0a', padding: '20px', border: '1px solid #00d4ff33', borderRadius: '8px', textAlign: 'center' }}>
             <p style={{ fontSize: '0.8rem', color: '#00d4ff' }}>HEMISPHERE B: ACTIVE</p>
             <small style={{ opacity: 0.3 }}>Monitoring Tenzo Forge...</small>
          </div>
        </div>
      </div>
    </div>
  );
}

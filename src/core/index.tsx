import React from 'react';
import ReactDOM from 'react-dom/client';
import SentinelTerminal from './Component/SentinelTerminal'; 

// FieldOS Ignition
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <SentinelTerminal />
    </React.StrictMode>
  );
}

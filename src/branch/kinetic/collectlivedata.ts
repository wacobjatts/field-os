import WebSocket from 'ws';

export function startLiveDataCollector(onMessage: (data: any) => void) {
  const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  ws.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg.toString());
      onMessage(parsed);
    } catch {}
  });

  ws.on('open', () => {
    console.log('Live data connected');
  });

  ws.on('close', () => {
    console.log('Live data disconnected');
  });

  return ws;
}
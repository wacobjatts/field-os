import { startLiveDataCollector } from './collectlivedata';

const ws = startLiveDataCollector((data) => {
  console.log('LIVE EVENT:', data);
});

process.on('SIGINT', () => {
  ws.close();
  process.exit(0);
});
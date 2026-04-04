/**
 * src/branch/kinetic/runlooprecorder.ts
 *
 * Entry point for continuous recorder loop.
 */

import { startBlackHoleLoop } from './looprecorder';

const handle = startBlackHoleLoop(100);

console.log('Black Hole loop recorder started.');

process.on('SIGINT', () => {
  handle.stop();
  console.log('Black Hole loop recorder stopped.');
  process.exit(0);
});
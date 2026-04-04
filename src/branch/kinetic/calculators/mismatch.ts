import { TradeBufferState } from '../types';

function clampSignedUnit(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

export function calculateMismatch(trades: TradeBufferState): number {
  const { buyWork, sellWork } = trades;
  const totalWork = buyWork + sellWork;

  if (totalWork <= 0) return 0;

  const mismatch = (buyWork - sellWork) / totalWork;

  return clampSignedUnit(mismatch);
}
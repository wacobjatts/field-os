import { calculateRealityGapPrecision } from './precision/realitygapprecision';
import { OrderBookSnapshot } from './types';

export function calculateKineticAnchor(
  book: OrderBookSnapshot,
  timestamp: number
): number {
  return calculateRealityGapPrecision(book, timestamp);
}
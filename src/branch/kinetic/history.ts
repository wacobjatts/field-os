/**
 * Kinetic History Tracker
 *
 * Stores recent slices for:
 * - debugging
 * - replay
 * - future backtesting
 */

import { KineticOrchestratorOutput } from './orchestrator';

export interface HistoryEntry {
  timestamp: number;
  midPrice: number;
  data: KineticOrchestratorOutput;
}

const MAX_HISTORY = 1000;

const history: HistoryEntry[] = [];

/**
 * Add a new snapshot to history
 */
export function pushHistory(entry: HistoryEntry): void {
  history.push(entry);

  // keep memory bounded
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
}

/**
 * Get full history
 */
export function getHistory(): HistoryEntry[] {
  return history;
}

/**
 * Get last N entries
 */
export function getRecentHistory(count: number): HistoryEntry[] {
  return history.slice(-count);
}

/**
 * Clear history (useful for testing)
 */
export function clearHistory(): void {
  history.length = 0;
}
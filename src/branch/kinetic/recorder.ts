/**
 * src/branch/kinetic/recorder.ts
 *
 * Simple branch-local recorder for Kinetic output.
 * Appends one JSON line per processed slice.
 */

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { KineticOrchestratorOutput } from './orchestrator';

export interface RecorderInput {
  timestamp: number;
  symbol: string;
  midPrice: number;
  output: KineticOrchestratorOutput;
}

export interface RecorderOptions {
  filePath: string;
  pretty?: boolean;
}

function ensureParentDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function initializeRecorder(filePath: string): void {
  ensureParentDir(filePath);

  if (!existsSync(filePath)) {
    writeFileSync(filePath, '', 'utf8');
  }
}

export function recordSlice(
  input: RecorderInput,
  options: RecorderOptions
): void {
  ensureParentDir(options.filePath);

  const row = {
    timestamp: input.timestamp,
    symbol: input.symbol,
    midPrice: input.midPrice,
    raw: input.output.raw,
    precision: input.output.precision
  };

  const line = options.pretty
    ? `${JSON.stringify(row, null, 2)}\n`
    : `${JSON.stringify(row)}\n`;

  appendFileSync(options.filePath, line, 'utf8');
}
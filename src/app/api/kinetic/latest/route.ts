import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_FILE = path.join(process.cwd(), 'data', 'kinetic-live-binance.jsonl');

async function readLatestJsonLine(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return null;
    }

    const latestLine = lines[lines.length - 1];
    return JSON.parse(latestLine);
  } catch {
    return null;
  }
}

export async function GET() {
  const latest = await readLatestJsonLine(DATA_FILE);

  return NextResponse.json({
    ok: true,
    latest
  });
}
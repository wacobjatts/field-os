import { PreparedSignal } from '../../core/engine/signal';
import { KineticOrchestratorOutput } from './orchestrator';
import { SourceProfile } from '../../core/engine/signal';

export function translateToSignals(
  output: KineticOrchestratorOutput,
  source: SourceProfile,
  timestamp: number
): PreparedSignal[] {
  const signals: PreparedSignal[] = [];

  for (const key of Object.keys(output.precision)) {
    const value = output.raw[key as keyof typeof output.raw];
    const confidence = output.precision[key as keyof typeof output.precision];

    signals.push({
      id: `${source.id}-${key}-${timestamp}`,
      dimension: key,
      value,
      confidence,
      sourceId: source.id,
      timestamp
    });
  }

  return signals;
}
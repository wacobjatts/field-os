import { PreparedSignal, SourceProfile } from '../../core/engine/signal';

export interface KineticDimension {
  id: string;
  name?: string;
  description?: string;
}

export function toPreparedSignal(
  dimensionId: string,
  value: number,
  precision: number,
  timestamp: number,
  source: SourceProfile,
  dimension?: KineticDimension
): PreparedSignal {
  return {
    dimensionId,
    value,
    precision,
    timestamp,
    source,
    dimension,
  };
}

import { SourceProfile } from '../core/engine/signal';
import { SystemState } from '../core/engine/tenzo';

import {
  createInitialKineticState,
  runKineticThroughTrunk
} from '../branch/kinetic/trunkbridge';

import { KineticSnapshot } from '../branch/kinetic/types';
import { getProjects, createProject } from './storage';

export interface KineticBridgeInput {
  snapshot: KineticSnapshot;
  previousMid: number;
  anchorMid: number;
}

export interface KineticBridgeOutput {
  state: SystemState;
  raw: Record<string, number>;
  precision: Record<string, number>;
}

const DEFAULT_SOURCE: SourceProfile = {
  id: 'kinetic-live',
  label: 'Kinetic Live Source',
  kind: 'synthetic',
  credibility: 1,
  sampleCount: 1000,
  trustMode: 'fixed',
  baselineBias: 0,
  reliabilityVariance: 0,
  lastUpdated: Date.now()
};

export class KineticBridge {
  private state: SystemState;
  private source: SourceProfile;

  constructor(source: SourceProfile = DEFAULT_SOURCE) {
    this.source = source;
    this.state = createInitialKineticState(source);
  }

  public getState(): SystemState {
    return this.state;
  }

  public reset(timestamp: number = Date.now()): void {
    this.state = createInitialKineticState(this.source, timestamp);
  }

  public step(input: KineticBridgeInput): KineticBridgeOutput {
    const result = runKineticThroughTrunk(this.state, {
      snapshot: input.snapshot,
      previousMid: input.previousMid,
      anchorMid: input.anchorMid,
      source: this.source
    });

    this.state = result.state;

    return {
      state: this.state,
      raw: result.branch.raw,
      precision: result.branch.precision
    };
  }

  /**
   * Optional persistence hook.
   * Safe to leave unused for now.
   */
  public async saveProjectRecord(project: Record<string, unknown>) {
    return createProject(project);
  }

  /**
   * Optional read hook.
   * Safe to leave unused for now.
   */
  public async readProjects() {
    return getProjects();
  }
}
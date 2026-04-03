import { Task } from '../../core/types';

export interface UncertaintyProfile {
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
}

export interface RiskAdjustedEstimate {
  expectedValue: number;
  standardDeviation: number;
  p90Value: number;
  suggestedContingency: number;
}

export interface BayesianRateState {
  mean: number;
  variance: number;
}

export interface BayesianObservation {
  mean: number;
  variance: number;
}

export interface FieldRateTaskInput {
  task: Task;
  quantity: number;
  laborRate: number;
  materialCost?: number;
  uncertainty: UncertaintyProfile;
}

const Z_90 = 1.28155;

// PERT expected value
export function calculatePertExpectedValue(profile: UncertaintyProfile): number {
  return (
    profile.optimistic +
    4 * profile.mostLikely +
    profile.pessimistic
  ) / 6;
}

// PERT standard deviation
export function calculatePertStandardDeviation(profile: UncertaintyProfile): number {
  return (profile.pessimistic - profile.optimistic) / 6;
}

// Risk-adjusted estimate
export function calculateRiskAdjustedEstimate(
  profile: UncertaintyProfile,
  confidenceZ: number = Z_90
): RiskAdjustedEstimate {
  const expectedValue = calculatePertExpectedValue(profile);
  const standardDeviation = calculatePertStandardDeviation(profile);
  const p90Value = expectedValue + confidenceZ * standardDeviation;
  const suggestedContingency = p90Value - expectedValue;

  return {
    expectedValue,
    standardDeviation,
    p90Value,
    suggestedContingency
  };
}

// Expected labor hours
export function calculateExpectedLaborHours(
  quantity: number,
  mhpuProfile: UncertaintyProfile
): number {
  const expectedMhpu = calculatePertExpectedValue(mhpuProfile);
  return quantity * expectedMhpu;
}

// P90 labor hours
export function calculateP90LaborHours(
  quantity: number,
  mhpuProfile: UncertaintyProfile
): number {
  const risk = calculateRiskAdjustedEstimate(mhpuProfile);
  return quantity * risk.p90Value;
}

export function calculateLaborCost(hours: number, laborRate: number): number {
  return hours * laborRate;
}

// Full task estimate
export function calculateTaskEstimate(input: FieldRateTaskInput) {
  const risk = calculateRiskAdjustedEstimate(input.uncertainty);

  const expectedLaborHours = input.quantity * risk.expectedValue;
  const p90LaborHours = input.quantity * risk.p90Value;

  const expectedLaborCost = calculateLaborCost(expectedLaborHours, input.laborRate);
  const p90LaborCost = calculateLaborCost(p90LaborHours, input.laborRate);

  const materialCost = input.materialCost ?? 0;

  return {
    taskId: input.task.id,
    expectedLaborHours,
    p90LaborHours,
    expectedLaborCost,
    p90LaborCost,
    materialCost,
    expectedTotalCost: expectedLaborCost + materialCost,
    p90TotalCost: p90LaborCost + materialCost,
    suggestedContingency: p90LaborCost - expectedLaborCost
  };
}

// Bayesian update
export function updateBayesianRate(
  prior: BayesianRateState,
  observation: BayesianObservation
): BayesianRateState {
  const priorPrecision = 1 / prior.variance;
  const observationPrecision = 1 / observation.variance;

  const posteriorVariance = 1 / (priorPrecision + observationPrecision);

  const posteriorMean =
    posteriorVariance *
    (prior.mean * priorPrecision + observation.mean * observationPrecision);

  return {
    mean: posteriorMean,
    variance: posteriorVariance
  };
}

// src/modules/macro/finance.ts

export interface TemporalDragInput {
  outstandingCapital: number;
  annualInterestRate: number; // decimal, e.g. 0.08 = 8%
  siteOverheadPerDay?: number;
  gcOverheadPerDay?: number;
  adminPerDay?: number;
  delayDays: number;
  expectedProfit?: number;
  affectedCostBase?: number; // cost exposed to escalation
  annualEscalationRate?: number; // decimal
}

export interface TemporalDragResult {
  dailyInterestCarry: number;
  dailyOverheadBurn: number;
  temporalDragPerDay: number;
  delayDays: number;
  escalationCost: number;
  totalDelayCost: number;
  profitErosionPct: number | null;
}

function safeNumber(value: number | undefined): number {
  return Number.isFinite(value) ? (value as number) : 0;
}

export function calculateDailyInterestCarry(
  outstandingCapital: number,
  annualInterestRate: number
): number {
  return (safeNumber(outstandingCapital) * safeNumber(annualInterestRate)) / 365;
}

export function calculateDailyOverheadBurn(input: {
  siteOverheadPerDay?: number;
  gcOverheadPerDay?: number;
  adminPerDay?: number;
}): number {
  return (
    safeNumber(input.siteOverheadPerDay) +
    safeNumber(input.gcOverheadPerDay) +
    safeNumber(input.adminPerDay)
  );
}

export function calculateEscalationCost(
  affectedCostBase: number = 0,
  annualEscalationRate: number = 0,
  delayDays: number = 0
): number {
  if (affectedCostBase <= 0 || annualEscalationRate <= 0 || delayDays <= 0) {
    return 0;
  }

  const delayYears = delayDays / 365;
  return affectedCostBase * (Math.pow(1 + annualEscalationRate, delayYears) - 1);
}

export function calculateTemporalDrag(input: TemporalDragInput): TemporalDragResult {
  const dailyInterestCarry = calculateDailyInterestCarry(
    input.outstandingCapital,
    input.annualInterestRate
  );

  const dailyOverheadBurn = calculateDailyOverheadBurn({
    siteOverheadPerDay: input.siteOverheadPerDay,
    gcOverheadPerDay: input.gcOverheadPerDay,
    adminPerDay: input.adminPerDay
  });

  const temporalDragPerDay = dailyInterestCarry + dailyOverheadBurn;

  const escalationCost = calculateEscalationCost(
    input.affectedCostBase,
    input.annualEscalationRate,
    input.delayDays
  );

  const totalDelayCost = temporalDragPerDay * input.delayDays + escalationCost;

  const profitErosionPct =
    input.expectedProfit && input.expectedProfit > 0
      ? totalDelayCost / input.expectedProfit
      : null;

  return {
    dailyInterestCarry,
    dailyOverheadBurn,
    temporalDragPerDay,
    delayDays: input.delayDays,
    escalationCost,
    totalDelayCost,
    profitErosionPct
  };
}

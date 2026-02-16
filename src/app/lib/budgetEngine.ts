import type { BudgetInputs, BudgetResult, ISODate } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isValidISODate(s: string): s is ISODate {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function parseISO(iso: ISODate): Date {
  return new Date(iso);
}

function daysBetweenISO(a: ISODate, b: ISODate): number {
  const da = parseISO(a).getTime();
  const db = parseISO(b).getTime();
  return Math.max(0, Math.round((db - da) / MS_PER_DAY));
}

export function calculateBudget(input: BudgetInputs): BudgetResult {
  const monthStartBalance = Number.isFinite(input.monthStartBalance)
    ? input.monthStartBalance
    : 0;

  const currentBalance = Number.isFinite(input.currentBalance)
    ? input.currentBalance
    : 0;

  const { monthStartDate, nextPayday, todayISO } = input;

  if (
    !isValidISODate(monthStartDate) ||
    !isValidISODate(nextPayday) ||
    !isValidISODate(todayISO)
  ) {
    return {
      totalDays: 1,
      daysElapsed: 0,
      remainingDays: 1,
      plannedDaily: 0,
      safeDaily: 0,
      safeWeek: 0,
      expectedBalanceNow: 0,
      delta: 0,
      mode: "normal",
    };
  }

  const totalDays = Math.max(
    1,
    daysBetweenISO(monthStartDate, nextPayday)
  );

  const plannedDaily = Math.floor(
    monthStartBalance / totalDays
  );

  const daysElapsed = daysBetweenISO(
    monthStartDate,
    todayISO
  );

  const remainingDays = Math.max(
    1,
    daysBetweenISO(todayISO, nextPayday)
  );

  const expectedBalanceNow =
    monthStartBalance - plannedDaily * daysElapsed;

  const delta = currentBalance - expectedBalanceNow;

  const safeDaily = Math.floor(
    Math.max(0, currentBalance / remainingDays)
  );

  const safeWeek = safeDaily * Math.min(7, remainingDays);

  return {
    totalDays,
    daysElapsed,
    remainingDays,
    plannedDaily,
    safeDaily,
    safeWeek,
    expectedBalanceNow,
    delta,
    mode: "normal",
  };
}

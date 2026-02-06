import { BUDGET, WEEKDAY_NO } from "./constants";
import type { BudgetInputs, BudgetResult, ISODate, WeekLabel } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isValidISODate(s: string): s is ISODate {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * NB: new Date("YYYY-MM-DD") tolkes som UTC. Vi bruker UTC-konsekvent for stabile dagsberegninger.
 */
function parseISO(iso: ISODate): Date {
  return new Date(iso);
}

function addDaysISO(iso: ISODate, days: number): ISODate {
  const d = parseISO(iso);
  const out = new Date(d.getTime() + days * MS_PER_DAY);
  return out.toISOString().slice(0, 10) as ISODate;
}

/**
 * Antall dager fra a til b (b eksklusiv), målt i hele dager.
 * Eksempel: a=2026-01-26, b=2026-02-01 => 6 (26..31)
 */
export function daysBetweenISO(a: ISODate, b: ISODate): number {
  const da = parseISO(a).getTime();
  const db = parseISO(b).getTime();
  const diff = Math.round((db - da) / MS_PER_DAY);
  return diff;
}

function weekdayText(iso: ISODate): string {
  const d = parseISO(iso);
  const wd = d.getUTCDay(); // 0=søn
  return WEEKDAY_NO[wd] ?? "";
}

function buildWeekLabel(todayISO: ISODate, segmentEndISO: ISODate): WeekLabel {
  return {
    startISO: todayISO,
    endISO: segmentEndISO,
    startText: weekdayText(todayISO),
    endText: weekdayText(segmentEndISO),
  };
}

function floorSafe(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

function toMoney(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export function calculateBudget(input: BudgetInputs): BudgetResult {
  const monthStartBalance = Number.isFinite(input.monthStartBalance)
    ? input.monthStartBalance
    : 0;

  // ⚠️ VIKTIG: currentBalance tolkes som SIST LAGREDE saldo (ikke pågående dag)
  const lastSavedBalance = Number.isFinite(input.currentBalance)
    ? input.currentBalance
    : 0;

  const monthStartDate = input.monthStartDate;
  const nextPayday = input.nextPayday;
  const todayISO = input.todayISO;

  if (!isValidISODate(monthStartDate) || !isValidISODate(nextPayday) || !isValidISODate(todayISO)) {
    return {
      totalDaysInPeriod: 1,
      plannedDaily: 0,
      daysElapsed: 0,
      remainingDaysTotal: 1,
      remainingDaysThisWeek: 1,
      weekLabel: buildWeekLabel(todayISO as ISODate, todayISO as ISODate),
      plannedWeekBudgetThisWeek: 0,
      expectedBalanceNow: 0,
      delta: 0,
      mode: "normal",
      safeDaily: 0,
      safeWeek: 0,
      horizonDays: 1,
    };
  }

  // Totalt antall dager i perioden
  const totalDaysInPeriodRaw = daysBetweenISO(monthStartDate, nextPayday);
  const totalDaysInPeriod = Math.max(BUDGET.minDays, totalDaysInPeriodRaw);

  const plannedDaily = Math.max(0, floorSafe(monthStartBalance / totalDaysInPeriod));

  // Hvor langt vi er kommet (gårsdager, ikke i dag)
  const daysElapsedRaw = daysBetweenISO(monthStartDate, todayISO);
  const daysElapsed = clampInt(daysElapsedRaw, 0, Math.max(0, totalDaysInPeriod - 1));

  const remainingDaysTotalRaw = daysBetweenISO(todayISO, nextPayday);
  const remainingDaysTotal = Math.max(BUDGET.minDays, remainingDaysTotalRaw);

  // Uke-segment
  const segmentIndex = Math.floor(daysElapsed / BUDGET.segmentDays);
  const dayIndexInSegment = daysElapsed % BUDGET.segmentDays;

  const remainingInSegment = BUDGET.segmentDays - dayIndexInSegment;
  const remainingDaysThisWeek = Math.max(
    BUDGET.minDays,
    Math.min(remainingInSegment, remainingDaysTotal)
  );

  const segmentEndISO = addDaysISO(todayISO, remainingDaysThisWeek - 1);
  const weekLabel = buildWeekLabel(todayISO, segmentEndISO);

  const plannedWeekBudgetThisWeek = plannedDaily * remainingDaysThisWeek;

  // 👉 Forventet saldo etter GÅRSDAGEN
  const expectedBalanceNow = monthStartBalance - plannedDaily * daysElapsed;

  // 👉 Avvik basert på sist lagrede saldo (ikke pågående dag)
  const delta = lastSavedBalance - expectedBalanceNow;

  // Disponibelt denne uken = plan + avvik
  const availableThisWeek = plannedWeekBudgetThisWeek + delta;

  let mode: "normal" | "merged" = "normal";
  let horizonDays = remainingDaysThisWeek;

  let safeDaily = 0;
  let safeWeek = 0;

  if (availableThisWeek > 0) {
    safeDaily = toMoney(availableThisWeek / remainingDaysThisWeek);
    safeDaily = Math.max(BUDGET.minSafeDaily, safeDaily);
    safeWeek = toMoney(safeDaily * remainingDaysThisWeek);
  } else {
    // slå sammen uker ved krise
    mode = "merged";

    let hDays = remainingDaysThisWeek;

    while (hDays < remainingDaysTotal) {
      const horizonAvailable = plannedDaily * hDays + delta;
      if (horizonAvailable > 0) break;
      hDays = Math.min(hDays + BUDGET.segmentDays, remainingDaysTotal);
    }

    horizonDays = Math.max(BUDGET.minDays, hDays);

    safeDaily = toMoney(lastSavedBalance / horizonDays);
    safeDaily = Math.max(BUDGET.minSafeDaily, safeDaily);
    safeWeek = toMoney(safeDaily * remainingDaysThisWeek);
  }

  return {
    totalDaysInPeriod,
    plannedDaily,
    daysElapsed,
    remainingDaysTotal,
    remainingDaysThisWeek,
    weekLabel,
    plannedWeekBudgetThisWeek,
    expectedBalanceNow,
    delta,
    mode,
    safeDaily,
    safeWeek,
    horizonDays,
  };
}


/**
 * =========================
 * Test-scenarier (sanity)
 * =========================
 *
 * SCENARIO 1 (normal, foran):
 * start=15000, startDate=2026-01-01, nextPayday=2026-02-01 (31 dager)
 * plannedDaily=floor(15000/31)=483
 * today=2026-01-15 (daysElapsed=14)
 * expectedBalanceNow=15000-483*14=15000-6762=8238
 * currentBalance=9000 => delta=762
 * remainingDaysThisWeek (segment fra start): daysElapsed%7=0 => 7 (men capped mot remainingDaysTotal)
 * plannedWeekBudgetThisWeek=483*7=3381
 * availableThisWeek=3381+762=4143
 * safeDaily=floor(4143/7)=591, safeWeek=4137
 *
 * SCENARIO 2 (uhell, slå sammen):
 * start=15000, startDate=2026-01-01, nextPayday=2026-02-01
 * today=2026-01-20 (daysElapsed=19)
 * plannedDaily=483, expectedBalanceNow=15000-483*19=5823
 * currentBalance=3000 => delta=-2823
 * remainingDaysThisWeek: daysElapsed%7=5 => remaining=2
 * plannedWeekBudgetThisWeek=966
 * availableThisWeek=966-2823=-1857 => merged
 * horizonDays starter 2, sjekk plannedDaily*hDays + delta:
 * hDays=2 => 966-2823=-1857 (<=0) => legg til 7 => 9
 * hDays=9 => 4347-2823=1524 (>0) stopp
 * safeDaily=floor(3000/9)=333, safeWeek=666
 *
 * SCENARIO 3 (helt til lønn, fortsatt stramt):
 * start=6000, startDate=2026-01-01, nextPayday=2026-02-01 (31 dager)
 * plannedDaily=floor(6000/31)=193
 * today=2026-01-30 (daysElapsed=29), expected=6000-193*29=403
 * currentBalance=100 => delta=-303
 * remainingDaysTotal=2 (30,31)
 * remainingDaysThisWeek=min( (7-(29%7=1)=6), 2)=2
 * plannedWeekBudgetThisWeek=386
 * available=386-303=83 (>0) normal
 * safeDaily=floor(83/2)=41, safeWeek=82
 */

import type { ISODate } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ---------- Date helpers (UTC-safe) ----------
function isoToParts(iso: ISODate) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function toUTCDate(iso: ISODate) {
  const { y, m, d } = isoToParts(iso);
  return new Date(Date.UTC(y, m - 1, d));
}

function diffDays(a: ISODate, b: ISODate): number {
  return Math.floor((toUTCDate(b).getTime() - toUTCDate(a).getTime()) / MS_PER_DAY);
}

// Mandag = 0, Tirsdag = 1 ... Søndag = 6
function weekdayIndexMon0(iso: ISODate): number {
  const day = toUTCDate(iso).getUTCDay(); // 0=søn..6=lør
  return day === 0 ? 6 : day - 1;
}

function floorMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// ---------- Types ----------
export type WeekEngineInput = {
  monthStartBalance: number;
  plannedDaily: number;
  currentBalance: number;

  monthStartDate: ISODate;
  todayISO: ISODate;

  // antall dager igjen i perioden (fra i dag t.o.m. dagen før lønn / til lønn-avgrensing i motor)
  remainingDaysTotal: number;
};

export type WeekEngineResult = {
  // “Trygt å bruke per dag” i aktiv periode fra og med i dag
  daily: number;

  // hvor mange dager denne daily gjelder (inneværende uke alene, eller “låst sammen” med neste uker)
  spanDays: number;

  // hvor mange *hele* uker som er “hekta på” i tillegg til inneværende uke
  weeksAttached: number;

  // hvor mange dager som gjenstår i inneværende uke (mandag–søndag) innenfor perioden
  remainingThisWeek: number;
};

// ---------- Core logic (A) ----------
// A-regel: Vi “låner” (slår sammen) først når inneværende uke faktisk er tom.
// Extra penger: legges i inneværende uke (så du får høyere daily nå), uten å “sprenge” totalsum.
export function calculateWeek(input: WeekEngineInput): WeekEngineResult {
  const plannedDaily = Number.isFinite(input.plannedDaily) ? input.plannedDaily : 0;
  const currentBalance = Number.isFinite(input.currentBalance) ? input.currentBalance : 0;
  const remainingDaysTotal = Number.isFinite(input.remainingDaysTotal) ? input.remainingDaysTotal : 0;

  if (plannedDaily <= 0 || remainingDaysTotal <= 0) {
    return { daily: 0, spanDays: 0, weeksAttached: 0, remainingThisWeek: 0 };
  }

  // dager igjen i inneværende uke (mandag–søndag), men aldri mer enn remainingDaysTotal
  const wd = weekdayIndexMon0(input.todayISO); // 0..6
  const remainingThisWeekRaw = 7 - wd; // inkl i dag
  const remainingThisWeek = clampInt(remainingThisWeekRaw, 1, remainingDaysTotal);

  // Bygg fremover-segmenter (uke-biter) til vi dekker remainingDaysTotal
  // segment[0] = inneværende uke (remainingThisWeek dager)
  // segment[1..] = 7 dager, siste kan være kort
  type Segment = { days: number; budget: number };
  const segments: Segment[] = [];

  let daysLeft = remainingDaysTotal;

  // første segment (inneværende uke)
  const firstDays = Math.min(remainingThisWeek, daysLeft);
  segments.push({ days: firstDays, budget: plannedDaily * firstDays });
  daysLeft -= firstDays;

  // neste segmenter (hele uker)
  while (daysLeft > 0) {
    const d = Math.min(7, daysLeft);
    segments.push({ days: d, budget: plannedDaily * d });
    daysLeft -= d;
  }

  // Plan-penger igjen i perioden
  const planRemaining = plannedDaily * remainingDaysTotal;

  // Differanse mellom faktisk saldo og plan for resten av perioden
  // + => ekstra penger (legg i inneværende uke)
  // - => mangler penger (trekk fra inneværende uke først, så neste, osv)
  let deltaRemaining = currentBalance - planRemaining;

  if (deltaRemaining >= 0) {
    // ekstra penger -> alt inn i inneværende uke
    segments[0].budget += deltaRemaining;
  } else {
    // mangler penger -> trekk fra uke 0, så uke 1, osv (aldri under 0)
    let deficit = -deltaRemaining;

    for (let i = 0; i < segments.length && deficit > 0; i++) {
      const canTake = Math.min(deficit, segments[i].budget);
      segments[i].budget -= canTake;
      deficit -= canTake;
    }
    // Hvis deficit fortsatt > 0: vi er “tom” før payday. Da blir alt 0 uansett.
  }

  // Nå har vi et budsjett per segment som summerer til <= currentBalance (og normalt lik currentBalance).
  // A: Vi slår kun sammen hvis inneværende uke-segment er 0 (tom).
  // (Hvis den er >0, skal neste uke ikke påvirkes enda.)
  const firstBudget = segments[0].budget;

  if (firstBudget > 0) {
    // Inneværende uke har fortsatt penger -> ingen borrowing ennå.
    const daily = floorMoney(firstBudget / segments[0].days);
    return {
      daily,
      spanDays: segments[0].days,
      weeksAttached: 0,
      remainingThisWeek,
    };
  }

  // Inneværende uke er tom -> slå sammen med neste segmenter til vi finner budsjett >0
  let mergedDays = segments[0].days;
  let mergedBudget = segments[0].budget; // 0
  let idx = 1;

  while (idx < segments.length && mergedBudget <= 0) {
    mergedDays += segments[idx].days;
    mergedBudget += segments[idx].budget;
    idx++;
  }

  const daily = mergedDays > 0 ? floorMoney(mergedBudget / mergedDays) : 0;

  // weeksAttached: hvor mange *hele* uker (7-dagers segmenter) som er inkludert i mergedperioden
  // segments[0] er “deluke”; segments[1] er vanligvis første hele uke.
  let weeksAttached = 0;
  // Vi regner hele uker som er med i merge: segment 1..(idx-1) som har days===7
  for (let j = 1; j < idx; j++) {
    if (segments[j].days === 7) weeksAttached++;
  }

  return {
    daily,
    spanDays: mergedDays,
    weeksAttached,
    remainingThisWeek,
  };
}

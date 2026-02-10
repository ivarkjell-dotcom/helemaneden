// src/app/lib/overview.ts

import { calculateBudget } from "./budget";
import type { ISODate } from "./types";
import type { BalanceEntry } from "./history";

export type DayState = "past" | "today" | "future";

export type OverviewDay = {
  dateISO: ISODate;
  weekday: string;
  state: DayState;
  amount: number;
};

export type OverviewWeek = {
  weekStartISO: ISODate;
  weekEndISO: ISODate;
  days: OverviewDay[];
  safeWeek: number;
};


function getDayState(dateISO: ISODate, todayISO: ISODate): DayState {
  if (dateISO < todayISO) return "past";
  if (dateISO === todayISO) return "today";
  return "future";
}

function startOfWeekISO(iso: ISODate): ISODate {
  const d = new Date(iso);
  const day = d.getUTCDay(); // 0 = søn
  const diff = day === 0 ? -6 : 1 - day; // mandag som start
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10) as ISODate;
}

export function groupDaysIntoWeeks(
  days: OverviewDay[],
  safeDaily: number
): OverviewWeek[] {
  const weeksMap = new Map<ISODate, OverviewDay[]>();


  for (const day of days) {
    const weekStart = startOfWeekISO(day.dateISO);
    if (!weeksMap.has(weekStart)) {
      weeksMap.set(weekStart, []);
    }
    weeksMap.get(weekStart)!.push(day);
  }

  return Array.from(weeksMap.entries()).map(([weekStartISO, days]) => {
    const weekEndISO = days[days.length - 1].dateISO;
    return {
      weekStartISO,
      weekEndISO,
      days,
      safeWeek: safeDaily * days.length,
    };
  });
}

export function buildOverviewDays(params: {
  startISO: ISODate;
  endISO: ISODate;
  todayISO: ISODate;
  history: BalanceEntry[];
  currentBalance: number;
  budgetInputs: Parameters<typeof calculateBudget>[0];
  weekdayLabels: string[];
}): OverviewDay[] {
  const {
    startISO,
    endISO,
    todayISO,
    history,
    currentBalance,
    budgetInputs,
    weekdayLabels,
  } = params;

  const result = calculateBudget(budgetInputs);
  const plannedDaily = result.plannedDaily;

  const historyMap = Object.fromEntries(
    history.map((h) => [h.date, h.balance])
  );

  const out: OverviewDay[] = [];

  let d = new Date(startISO);
  const end = new Date(endISO);

  while (d <= end) {
    const iso = d.toISOString().slice(0, 10) as ISODate;
    const state = getDayState(iso, todayISO);

    const budget = calculateBudget(budgetInputs);
const safeDaily = budget.safeDaily;

let amount = safeDaily;

// Fortid: vi viser ikke dagsramme bakover (kan være null / grå)
if (state === "past") {
  amount = 0; // eller null hvis du vil skjule
}

// I dag og fremtid: alltid safeDaily
if (state === "today" || state === "future") {
  amount = safeDaily;
}


    out.push({
      dateISO: iso,
      weekday: weekdayLabels[d.getUTCDay()] ?? "",
      state,
      amount,
    });

    d.setDate(d.getDate() + 1);
  }

  return out;
}

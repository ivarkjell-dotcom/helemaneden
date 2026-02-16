// src/app/lib/overview.ts

import type { ISODate } from "./types";

export type DayState =
  | "past"
  | "today"
  | "future"
  | "outside"
  | "payday";

export type OverviewDay = {
  dateISO: ISODate;
  weekday: string;
  state: DayState;
  amount: number | null;
};

export type OverviewWeek = {
  weekStartISO: ISODate;
  weekEndISO: ISODate;
  days: OverviewDay[];
  weekTotal: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addDays(iso: ISODate, days: number): ISODate {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10) as ISODate;
}

function daysBetween(a: ISODate, b: ISODate): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.floor((db - da) / MS_PER_DAY);
}

function startOfWeekISO(iso: ISODate): ISODate {
  const d = new Date(iso);
  const wd = d.getUTCDay();
  const diff = wd === 0 ? -6 : 1 - wd;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10) as ISODate;
}

function endOfWeekISO(iso: ISODate): ISODate {
  return addDays(startOfWeekISO(iso), 6);
}

/* ============================= */
/* 🧠 HOVEDMODELL */
/* ============================= */

export function buildCalendarWeekBudgetModel(params: {
  startISO: ISODate;
  endISO: ISODate;
  todayISO: ISODate;
  currentBalance: number;
  weekdayLabels: string[];
}): OverviewWeek[] {
  const {
    startISO,
    endISO,
    todayISO,
    currentBalance,
    weekdayLabels,
  } = params;

  /* 🔒 ROBUSTHET: Periode er over */
  if (todayISO >= endISO) {
    return [
      {
        weekStartISO: todayISO,
        weekEndISO: todayISO,
        days: [
          {
            dateISO: todayISO,
            weekday:
              weekdayLabels[new Date(todayISO).getUTCDay()] ?? "",
            state: "today",
            amount: 0,
          },
        ],
        weekTotal: 0,
      },
    ];
  }

  const weeks: OverviewWeek[] = [];

  let remaining = currentBalance;

  let cursor = startOfWeekISO(startISO);

  while (cursor <= endISO) {
    const weekStartISO = cursor;
    const weekEndISO = endOfWeekISO(cursor);
    const actualWeekEnd =
      weekEndISO > endISO ? endISO : weekEndISO;

    const days: OverviewDay[] = [];
    let weekTotal = 0;

    for (let i = 0; i < 7; i++) {
      const dateISO = addDays(weekStartISO, i);

      let state: DayState = "future";
      let amount: number | null = null;

      if (dateISO < startISO || dateISO > endISO) {
        state = "outside";
        amount = null;
      } else if (dateISO < todayISO) {
        state = "past";
        amount = null;
      } else {
        if (dateISO === todayISO) state = "today";
        else state = "future";

        const remainingDays = Math.max(
          1,
          daysBetween(todayISO, endISO)
        );

        const daily = Math.floor(
          remaining / remainingDays
        );

        amount = daily;
        remaining -= daily;
        weekTotal += daily;
      }

      days.push({
        dateISO,
        weekday:
          weekdayLabels[new Date(dateISO).getUTCDay()] ?? "",
        state,
        amount,
      });
    }

    weeks.push({
      weekStartISO,
      weekEndISO: actualWeekEnd,
      days,
      weekTotal,
    });

    cursor = addDays(weekStartISO, 7);
  }

  return weeks;
}

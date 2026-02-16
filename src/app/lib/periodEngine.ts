// src/app/lib/periodEngine.ts

import type { ISODate } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUTCDate(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDays(iso: ISODate, days: number): ISODate {
  const d = toUTCDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10) as ISODate;
}

function diffDays(a: ISODate, b: ISODate): number {
  return Math.floor(
    (toUTCDate(b).getTime() - toUTCDate(a).getTime()) / MS_PER_DAY
  );
}

function getWeekIndexFromStart(
  monthStartDate: ISODate,
  iso: ISODate
) {
  const days = diffDays(monthStartDate, iso);
  return Math.floor(days / 7);
}

export type PeriodDay = {
  iso: ISODate;
  weekIndex: number;
  isPast: boolean;
  amount: number | null;
};

export type PeriodWeek = {
  weekIndex: number;
  days: PeriodDay[];
  weekSum: number;
  isPastWeek: boolean;
  isActivePeriod: boolean;
};

export type PeriodModel = {
  weeks: PeriodWeek[];
};

export function generatePeriodModel(params: {
  monthStartDate: ISODate;
  todayISO: ISODate;
  nextPayday: ISODate;
  plannedDaily: number;
  activeDaily: number;
  activeSpanDays: number;
  weeksAttached: number;
}): PeriodModel {
  const {
    monthStartDate,
    todayISO,
    nextPayday,
    plannedDaily,
    activeDaily,
    activeSpanDays,
    weeksAttached,
  } = params;

  const totalDays = diffDays(monthStartDate, nextPayday);

  const weeksMap = new Map<number, PeriodWeek>();

  for (let i = 0; i < totalDays; i++) {
    const iso = addDays(monthStartDate, i);
    const weekIndex = getWeekIndexFromStart(
      monthStartDate,
      iso
    );

    const isPast = iso < todayISO;

    const daysFromToday = diffDays(todayISO, iso);

    let amount: number | null = null;

    if (!isPast) {
      if (daysFromToday < activeSpanDays) {
        amount = activeDaily;
      } else {
        amount = plannedDaily;
      }
    }

    if (!weeksMap.has(weekIndex)) {
      weeksMap.set(weekIndex, {
        weekIndex,
        days: [],
        weekSum: 0,
        isPastWeek: true,
        isActivePeriod:
          weekIndex <=
          getWeekIndexFromStart(
            monthStartDate,
            todayISO
          ) + weeksAttached,
      });
    }

    const week = weeksMap.get(weekIndex)!;

    week.days.push({
      iso,
      weekIndex,
      isPast,
      amount,
    });

    if (!isPast && amount !== null) {
      week.weekSum += amount;
      week.isPastWeek = false;
    }
  }

  return {
    weeks: Array.from(weeksMap.values()),
  };
}

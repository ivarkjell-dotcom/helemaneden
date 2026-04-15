"use client";

import { useEffect, useMemo, useState } from "react";
import type { ISODate } from "../../lib/types";
import { loadHistory } from "../../lib/history";
import { calculateWeek } from "../../lib/weekEngine";
import { PageHeader } from "../../components/PageHeader";

const SETTINGS_KEY = "hm_settings_v1";
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_COLOR = "#62AAC0";

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

function toUTC(iso: ISODate) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDays(iso: ISODate, days: number): ISODate {
  const d = toUTC(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10) as ISODate;
}

function diffDays(a: ISODate, b: ISODate) {
  return Math.floor((toUTC(b).getTime() - toUTC(a).getTime()) / MS_PER_DAY);
}

function weekdayIndex(iso: ISODate) {
  const day = toUTC(iso).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.floor(n));
}

export default function OverviewPage() {
  const [monthStartBalance, setMonthStartBalance] = useState(0);
  const [monthStartDate, setMonthStartDate] = useState<ISODate>(todayISO());
  const [nextPayday, setNextPayday] = useState<ISODate>(todayISO());
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);

    if (raw) {
      const s = JSON.parse(raw);
      setMonthStartBalance(s.monthStartBalance ?? 0);
      setMonthStartDate(s.monthStartDate ?? todayISO());
      setNextPayday(s.nextPayday ?? todayISO());
    }

    const history = loadHistory();
    const last = history[0];
    setCurrentBalance(last ? last.balance : 0);
  }, []);

  const weeks = useMemo(() => {
    const today = todayISO();
    const remainingTotal = diffDays(today, nextPayday);

    const totalDaysPeriod = Math.max(
      1,
      diffDays(monthStartDate, nextPayday)
    );

    const plannedDaily = Math.floor(
      monthStartBalance / totalDaysPeriod
    );

    const weekCalc = calculateWeek({
      monthStartBalance,
      plannedDaily,
      currentBalance,
      monthStartDate,
      todayISO: today,
      remainingDaysTotal: remainingTotal,
    });

    const firstMonday = addDays(
      monthStartDate,
      -weekdayIndex(monthStartDate)
    );

    const lastSunday = addDays(
      nextPayday,
      6 - weekdayIndex(nextPayday)
    );

    let cursor = firstMonday;
    const result: any[] = [];

    while (cursor <= lastSunday) {
      const weekStart = cursor;
      const weekEnd = addDays(weekStart, 6);

      const isPastWeek = weekEnd < today;
      const isCurrentWeek =
        today >= weekStart && today <= weekEnd;

      const days: any[] = [];
      let weekSum = 0;
      let hasActiveAmount = false;

      const activeSpanEnd = addDays(
        today,
        weekCalc.spanDays - 1
      );

      for (let i = 0; i < 7; i++) {
        const iso = addDays(weekStart, i);

        const isPastDay = iso < today;
        const outsidePeriod =
          iso < monthStartDate || iso >= nextPayday;

        let amount: number | null = null;

        const insideActiveSpan =
          iso >= today && iso <= activeSpanEnd;

        if (!outsidePeriod && insideActiveSpan) {
          amount = weekCalc.daily;
        } else if (!outsidePeriod && iso > activeSpanEnd) {
          amount = plannedDaily;
        }

        if (amount !== null) {
          weekSum += amount;
          hasActiveAmount = true;
        }

        days.push({
          iso,
          isPastDay,
          outsidePeriod,
          isToday: iso === today,
          amount,
        });
      }

      result.push({
        weekStart,
        isPastWeek,
        isCurrentWeek,
        days,
        weekSum,
        hasActiveAmount,
      });

      cursor = addDays(cursor, 7);
    }

    return result;
  }, [
    monthStartBalance,
    monthStartDate,
    nextPayday,
    currentBalance,
  ]);

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <PageHeader
        title="Oversikt"
        subtitle="Slik motoren regner fremover"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        {weeks.map((week, i) => (
          <div
            key={i}
            className={`overview-card ${
              week.isCurrentWeek ? "current" : ""
            }`}
            style={{
  borderRadius: 20,
  padding: 16,

  border: week.isCurrentWeek
    ? `2px solid ${DAY_COLOR}`
    : "1px solid var(--border-soft)",


}}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Uke {i + 1}
            </div>

            {week.days.map((day: any, idx: number) => (
              <div
                key={idx}
                className={`overview-day ${
                  day.isToday
                    ? "today"
                    : day.isPastDay
                    ? "past"
                    : "future"
                }`}
                style={{
  display: "flex",
  justifyContent: "space-between",
  fontSize: day.isToday ? 16 : 14,

  color: day.isToday ? DAY_COLOR : undefined,
  fontWeight: day.isToday ? 600 : 400,
}}
              >
                <span
  style={{
    color: day.isToday ? DAY_COLOR : undefined,
    fontWeight: day.isToday ? 700 : 400,
  }}
>
  {new Date(day.iso).getUTCDate()}.
</span>

                <span>
                  {day.outsidePeriod || day.isPastDay
                    ? "-"
                    : day.amount !== null
                    ? `${fmtKr(day.amount)} kr`
                    : "-"}
                </span>
              </div>
            ))}

            {week.hasActiveAmount && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px dashed var(--border-soft)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Trygt denne uken: {fmtKr(week.weekSum)} kr
              </div>
            )}

            {week.isPastWeek && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  opacity: 0.5,
                  fontStyle: "italic",
                }}
              >
                Endt uke
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

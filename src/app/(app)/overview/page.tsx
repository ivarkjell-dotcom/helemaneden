"use client";

import { useEffect, useMemo, useState } from "react";
import { buildOverviewDays, groupDaysIntoWeeks } from "../../lib/overview";
import type { ISODate } from "../../lib/types";
import { loadHistory } from "../../lib/history";
import { WEEKDAY_NO } from "../../lib/constants";
import { PageHeader } from "../../components/PageHeader";

const SETTINGS_KEY = "hm_settings_v1";

const WEEKDAYS = ["man", "tir", "ons", "tor", "fre", "lør", "søn"] as const;

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

function fmtDateNO(iso: ISODate) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export default function OverviewPage() {
  const [monthStartBalance, setMonthStartBalance] = useState(0);
  const [monthStartDate, setMonthStartDate] = useState<ISODate>(todayISO());
  const [nextPayday, setNextPayday] = useState<ISODate>(todayISO());
  const [currentBalance, setCurrentBalance] = useState(0);

  // 1️⃣ Last inn settings + historikk
  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    let startBalance = 0;

    if (raw) {
      const s = JSON.parse(raw);
      startBalance = s.monthStartBalance ?? 0;
      setMonthStartBalance(startBalance);
      setMonthStartDate(s.monthStartDate ?? todayISO());
      setNextPayday(s.nextPayday ?? todayISO());
    }

    const history = loadHistory();
    const last = history[0];
    setCurrentBalance(last ? last.balance : startBalance);
  }, []);

  // 2️⃣ Bygg dager
  const overviewDays = useMemo(() => {
    return buildOverviewDays({
      startISO: monthStartDate,
      endISO: nextPayday,
      todayISO: todayISO(),
      history: loadHistory(),
      currentBalance,
      budgetInputs: {
        monthStartBalance,
        currentBalance,
        monthStartDate,
        nextPayday,
        todayISO: todayISO(),
      },
      weekdayLabels: [...WEEKDAY_NO],
    });
  }, [monthStartBalance, currentBalance, monthStartDate, nextPayday]);

  const safeDaily =
    overviewDays.find((d) => d.state === "today")?.amount ?? 0;

  const weeks = useMemo(() => {
    return groupDaysIntoWeeks(overviewDays, safeDaily);
  }, [overviewDays, safeDaily]);

  if (!overviewDays.length) {
    return <main className="page">Laster oversikt…</main>;
  }

  return (
    <main className="page" style={{ maxWidth: 520, margin: "0 auto" }}>
      <section className="section">
        {/* 🔒 Felles sidetittel */}
        <PageHeader
          title="Oversikt"
          subtitle={`Oppdatert: ${fmtDateNO(todayISO())}`}
        />

        {/* Uker side ved side */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {weeks.map((week, i) => {
            const isCurrentWeek = week.days.some(
              (d) => d.state === "today"
            );

            return (
              <div
                key={week.weekStartISO}
                style={{
                  border: isCurrentWeek
                    ? "2px solid #22C55E"
                    : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 14,
                  padding: 14,
                  background: "#fff",

                  display: "grid",
                  gridTemplateRows: "auto 1fr auto",
                }}
              >
                {/* Uke-header */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>
                    Uke {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.6,
                      marginTop: 2,
                    }}
                  >
                    {fmtDateNO(week.weekStartISO)} –{" "}
                    {fmtDateNO(week.weekEndISO)}
                  </div>
                </div>

                {/* Dager: fast man–søn */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr",
                    rowGap: 6,
                    columnGap: 8,
                  }}
                >
                  {WEEKDAYS.map((label) => {
                    const d = week.days.find(
                      (day) => day.weekday === label
                    );

                    return (
                      <div key={label} style={{ display: "contents" }}>
                        {/* Ukedag */}
                        <div
                          style={{
                            fontSize: 13,
                            opacity: d ? 1 : 0.25,
                            color:
                              d?.state === "today"
                                ? "#22C55E"
                                : d?.state === "past"
                                ? "#9CA3AF"
                                : "#1E3A8A",
                            fontWeight:
                              d?.state === "today" ? 600 : 400,
                          }}
                        >
                          {label}
                        </div>

                        {/* Beløp */}
                        <div
                          style={{
                            textAlign: "right",
                            fontSize: 14,
                            color:
                              d?.state === "today"
                                ? "#22C55E"
                                : d?.state === "past"
                                ? "#9CA3AF"
                                : "#1E3A8A",
                            fontWeight:
                              d?.state === "today" ? 600 : 400,
                          }}
                        >
                          {d ? `${fmtKr(d.amount)} kr` : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Uke-sum – alltid nederst */}
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop:
                      "1px dashed rgba(0,0,0,0.08)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  Trygt denne uken: {fmtKr(week.safeWeek)} kr
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

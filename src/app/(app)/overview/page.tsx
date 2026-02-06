"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateBudget } from "../../lib/budget";
import type { ISODate } from "../../lib/types";
import { loadHistory } from "../../lib/history";
import { WEEKDAY_NO } from "../../lib/constants";

const SETTINGS_KEY = "hm_settings_v1";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

function parseISO(iso: ISODate): Date {
  return new Date(iso);
}

function addDaysISO(iso: ISODate, days: number): ISODate {
  const d = parseISO(iso);
  const out = new Date(d.getTime() + days * MS_PER_DAY);
  return out.toISOString().slice(0, 10) as ISODate;
}

function weekdayText(iso: ISODate): string {
  const d = parseISO(iso);
  const wd = d.getUTCDay();
  return WEEKDAY_NO[wd] ?? "";
}

type SimulatedWeek = {
  index: number;
  days: number;
  safeDaily: number;
  safeWeek: number;
  delta: number;
  isPast: boolean;
  startISO: ISODate;
  endISO: ISODate;
};


export default function OverviewPage() {
  const [monthStartBalance, setMonthStartBalance] = useState<number>(0);
  const [monthStartDate, setMonthStartDate] = useState<ISODate>(todayISO());
  const [nextPayday, setNextPayday] = useState<ISODate>(todayISO());
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<number>(0);

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

  const h = loadHistory();
  const last = h[0];

  if (last) {
    setCurrentBalance(last.balance);
  } else {
    // ✅ Første dag: bruk startsaldo automatisk
    setCurrentBalance(startBalance);
  }
}, []);


  // 🔁 Simuler uke-for-uke (inkludert fortid, nå og fremtid)
  const weeks: SimulatedWeek[] = useMemo(() => {
  if (!monthStartDate || !nextPayday) return [];

  const out: SimulatedWeek[] = [];
  let index = 0;

  // ---------- 1️⃣ FORTID (fra monthStartDate til i går) ----------
  let pastDate = monthStartDate;

  while (pastDate < todayISO()) {
    const result = calculateBudget({
      monthStartBalance,
      currentBalance,
      monthStartDate,
      nextPayday,
      todayISO: pastDate,
    });

    if (!result || result.remainingDaysTotal <= 0) break;

    const daysThisWeek = result.remainingDaysThisWeek;

const startISO = pastDate;
const endISO = addDaysISO(pastDate, daysThisWeek - 1);

out.push({
  index,
  days: daysThisWeek,
  safeDaily: result.safeDaily,
  safeWeek: result.safeWeek,
  delta: result.delta,
  isPast: true,
  startISO,
  endISO,
});

    pastDate = addDaysISO(pastDate, daysThisWeek);
    index++;

    if (index > 10) break;
  }

  // ---------- 2️⃣ NÅ + FREMTID (fra i dag og fremover) ----------
  let simBalance = currentBalance;
  let simDate = todayISO();

  while (true) {
    const result = calculateBudget({
      monthStartBalance,
      currentBalance: simBalance,
      monthStartDate,
      nextPayday,
      todayISO: simDate,
    });

    if (!result || result.remainingDaysTotal <= 0) break;

    const daysThisWeek = result.remainingDaysThisWeek;

    const startISO = simDate;
const endISO = addDaysISO(simDate, daysThisWeek - 1);

out.push({
  index,
  days: daysThisWeek,
  safeDaily: result.safeDaily,
  safeWeek: result.safeWeek,
  delta: result.delta,
  isPast: false,
  startISO,
  endISO,
});


    simBalance = simBalance - result.safeWeek;
    simDate = addDaysISO(simDate, daysThisWeek);
    index++;

    if (result.remainingDaysTotal <= daysThisWeek) break;
    if (index > 12) break;
  }

  return out;
}, [monthStartBalance, currentBalance, monthStartDate, nextPayday]);

  // Finn nåværende uke (første ikke-past)
  const currentWeekIndex = weeks.findIndex((w) => !w.isPast);
  const safeActiveTab = currentWeekIndex === -1 ? 0 : currentWeekIndex;

  useEffect(() => {
    setActiveTab(safeActiveTab);
  }, [safeActiveTab]);

  if (weeks.length === 0) {
    return <main className="page">Laster oversikt…</main>;
  }

  const activeWeek = weeks[activeTab];


  
  return (
    <main className="page" style={{ maxWidth: 520, margin: "0 auto" }}>
      <section className="section">
        <div className="card">
          <div className="cardContent">

            <h2>Oversikt fremover</h2>
            <p style={{ opacity: 0.7 }}>
              Slik påvirker dagens saldo resten av perioden
            </p>

            {/* Tabs */}
<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
  {weeks.map((week, i) => {
    const isActive = i === activeTab;

    return (
      <button
        key={i}
        disabled={week.isPast}
        onClick={() => setActiveTab(i)}
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          background: isActive ? "rgba(0,0,0,0.05)" : "white",
          fontWeight: isActive ? 800 : 600,
          opacity: week.isPast ? 0.35 : 1,
          cursor: week.isPast ? "not-allowed" : "pointer",
        }}
      >
        <div style={{ lineHeight: 1.1 }}>
          <div>
            {isActive ? "Denne uken" : `Uke ${i + 1}`}
          </div>
          <div style={{ fontSize: 9, opacity: 0.6 }}>
            {weekdayText(week.startISO)}–{weekdayText(week.endISO)}
          </div>
        </div>
      </button>
    );
  })}
</div>

            {/* Innhold */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 14, opacity: 0.7 }}>
                {activeWeek.isPast
                  ? `Uke ${activeTab + 1} (ferdig)`
                  : activeTab === safeActiveTab
                  ? "Nåværende uke"
                  : `Uke ${activeTab + 1}`}{" "}
                • {activeWeek.days} dager igjen
              </div>

              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
                {fmtKr(activeWeek.safeWeek)} kr disponibelt
              </div>

              <div style={{ marginTop: 6, fontSize: 14 }}>
                {fmtKr(activeWeek.safeDaily)} kr per dag
              </div>

              {/* Forklaring */}
              {!activeWeek.isPast && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    borderRadius: 12,
                    background: "rgba(0,0,0,0.04)",
                    fontSize: 13,
                  }}
                >
                  {activeWeek.delta < 0 && (
                    <>🟡 Du har brukt mer enn planlagt tidligere. Derfor er beløpet for denne uken justert ned.</>
                  )}

                  {activeWeek.delta === 0 && (
                    <>🟢 Du følger planen ganske jevnt. Beløpet er fordelt likt utover resten av perioden.</>
                  )}

                  {activeWeek.delta > 0 && (
                    <>🟢 Du har brukt mindre enn planlagt. Derfor har du en høyere disponibel sum de neste dagene.</>
                  )}
                </div>
              )}

              {activeWeek.isPast && (
                <div style={{ marginTop: 16, fontSize: 13, opacity: 0.45 }}>
                  Denne uken er ferdig og påvirkes ikke av dagens saldo.
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

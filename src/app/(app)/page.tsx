"use client";

import { calculateWeek } from "../lib/weekEngine";
import { getMergeMessage } from "../lib/getMergeMessage";
import { EmptyStateMissingBudget } from "../components/EmptyStateMissingBudget";
import InstallPrompt from "../components/InstallPrompt";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculateBudget } from "../lib/budgetEngine";
import type { ISODate } from "../lib/types";
import { PageHeader } from "../components/PageHeader";
import { Tabs } from "../components/Tabs";
import { HistoryDropdown } from "../components/HistoryDropdown";
import { addHistoryEntry, loadHistory, type BalanceEntry } from "../lib/history";
import { incrementOpens } from "../lib/metrics";
import { incrementInputs } from "../lib/metrics";


type TabKey = "day" | "week" | "month";

const SETTINGS_KEY = "hm_settings_v1";
const HAS_REDIRECTED_KEY = "hm_has_redirected_to_settings";

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

function nowTimeNO() {
  return new Intl.DateTimeFormat("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function fmtDateShortNO(iso: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(iso));
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

/* TOOLTIP */
function InputInfoTooltip() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
  onClick={() => setOpen((o) => !o)}
  style={{
  background: "transparent",
  border: "none",        // 👈 fjerner ringen
  outline: "none",       // 👈 fjerner focus-ring
  boxShadow: "none",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}}
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--icon-muted)"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="10" x2="12" y2="16" />
    <circle cx="12" cy="7" r="1" fill="var(--icon-muted)" />
  </svg>
</button>

      {open && (
  <div
    style={{
      position: "absolute",
      top: "120%",
      right: 0,

      background: "#fff",                  // 👈 hvit bakgrunn
      color: "var(--text-primary)",

      padding: "14px 16px",
      borderRadius: 20,

      boxShadow: "0 12px 30px rgba(0,0,0,0.15)", // 👈 flytende følelse
      border: "1px solid rgba(0,0,0,0.06)",

      fontSize: 13,
      lineHeight: 1.5,

      width: "min(280px, 80vw)",

      zIndex: 10000,
    }}
  >
    Legg inn saldo fra brukskonto hver dag.
    Da ser du hva som er trygt å bruke uten å gå tom før perioden er over.
  </div>
)}
    </div>
  );
}

/* HOME */
export default function Home() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("day");
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [history, setHistory] = useState<BalanceEntry[]>([]);
  const [balanceInput, setBalanceInput] = useState<string>("");
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);
  const [today, setToday] = useState<ISODate>(todayISO());

  const [monthStartBalance, setMonthStartBalance] = useState<number>(0);
  const [monthStartDate, setMonthStartDate] = useState<ISODate>(todayISO());
  const [nextPayday, setNextPayday] = useState<ISODate>(todayISO());


  
  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);

    let startBalance = 0;
    let settings: any = null;

    if (raw) {
      settings = JSON.parse(raw);
      startBalance = settings.monthStartBalance ?? 0;

      setMonthStartBalance(startBalance);
      setMonthStartDate(settings.monthStartDate ?? todayISO());
      setNextPayday(settings.nextPayday ?? todayISO());
    }

    const h = loadHistory();
    setHistory(h);

    const last = h[0];
    setCurrentBalance(last ? last.balance : startBalance);

    const hasRedirected = localStorage.getItem(HAS_REDIRECTED_KEY) === "true";

    const settingsMissing =
      !raw ||
      !settings?.monthStartBalance ||
      !settings?.monthStartDate ||
      !settings?.nextPayday;

    if (settingsMissing && !hasRedirected) {
      localStorage.setItem(HAS_REDIRECTED_KEY, "true");
      router.replace("/settings");
    }
  }, [router]);

  useEffect(() => {
  if (!sessionStorage.getItem("hm_opened")) {
    incrementOpens();
    sessionStorage.setItem("hm_opened", "true");
  }
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(todayISO());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function saveBalanceNow() {
  const value = Number(balanceInput) || 0;

  const updated = addHistoryEntry({
    balance: value,
    date: today,
    time: nowTimeNO(),
  });

  setHistory(updated);
  setCurrentBalance(value);
  setBalanceInput("");
  setLastUpdatedTime(nowTimeNO());

  incrementInputs();
}

  const lastSavedBalance = history[0]?.balance ?? currentBalance;
  const alreadyUpdatedToday = history.some((h) => h.date === today);

  const result = useMemo(() => {
    return calculateBudget({
      monthStartBalance,
      currentBalance: lastSavedBalance,
      monthStartDate,
      nextPayday,
      todayISO: today,
    });
  }, [monthStartBalance, lastSavedBalance, monthStartDate, nextPayday, today]);

  const weekResult = useMemo(() => {
    return calculateWeek({
      monthStartBalance,
      plannedDaily: result.plannedDaily,
      currentBalance: lastSavedBalance,
      monthStartDate,
      todayISO: today,
      remainingDaysTotal: result.remainingDays,
    });
  }, [monthStartBalance, result, lastSavedBalance, today]);

  // 🔧 RIKTIG ukesverdi (kun denne kalenderuken)
const todayDate = new Date(today);
const dayOfWeek = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1; // man=0
const daysLeftThisWeek = 7 - dayOfWeek;

const weekSafeAmount =
  weekResult.daily * Math.min(daysLeftThisWeek, weekResult.spanDays);

  if (!result || result.totalDays <= 0) {
    return <EmptyStateMissingBudget />;
  }

  return (
    <main
  style={{
    maxWidth: 520,
    margin: "0 auto",
    padding: 16, // 👈 DETTE ER DET VIKTIGE
  }}
>
      <InstallPrompt />

      <PageHeader
        title="Slik ligger du an i dag"
        subtitle={fmtDateShortNO(new Date().toISOString())}
      />

      {/* HOVEDKORT */}
      <section style={{ marginTop: 16 }}>
        <div
  style={{
    background: "var(--bg-card)",
    borderRadius: 20,
    padding: "12px 24px 24px",

    /* 🔥 Del opp border */
    borderLeft: "1px solid var(--border-soft)",
borderRight: "1px solid var(--border-soft)",
borderBottom: "1px solid var(--border-soft)",
borderTop: "none", // 🔥 VIKTIG

    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    position: "relative",
    zIndex: 1,
  }}
>
          <div
  style={{
    position: "relative",
    zIndex: 5,

    margin: "-36px -24px -2px -24px", // 🔥 tightere
  }}
>
  <Tabs value={activeTab} onChange={setActiveTab} />
</div>

          <div style={{ marginTop: 20 }}>
            {activeTab === "day" && (
              <>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Trygt i dag
                  </div>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      color: "#62AAC0",
                    }}
                  >
                    {fmtKr(weekResult.daily)} kr
                  </div>
                </div>
                {weekResult.weeksAttached > 0 && (
  <div
    style={{
      marginTop: 6,
      fontSize: 13,
      color: "#6B7280",
      lineHeight: 1.4,
    }}
  >
    {getMergeMessage(weekResult.weeksAttached)}
  </div>
)}
                <div
                 style={{
                 height: 1,
                 background: "rgba(0,0,0,0.08)",
                 margin: "16px 0",
               }}
                  />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    Trygt denne uken
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: "#C07862",
                    }}
                  >
                    {fmtKr(weekSafeAmount)} kr
                  </div>
                </div>
                
              </>
            )}

            {activeTab === "week" && (
              <>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Trygt denne uken
                  </div>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      color: "#C07862",
                    }}
                  >
                    {fmtKr(weekSafeAmount)} kr
                  </div>
                </div>
                {weekResult.weeksAttached > 0 && (
  <div
    style={{
      marginTop: 6,
      fontSize: 13,
      color: "#6B7280",
      lineHeight: 1.4,
    }}
  >
    {getMergeMessage(weekResult.weeksAttached)}
  </div>
)}
                 <div
  style={{
    height: 1,
    background: "rgba(0,0,0,0.08)",
    margin: "16px 0",
  }}
/>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    Trygt i dag
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      color: "#62AAC0",
                    }}
                  >
                    {fmtKr(weekResult.daily)} kr
                  </div>
                </div>
              </>
            )}

            {activeTab === "month" && (
              <>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Igjen denne perioden
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 800 }}>
                    {fmtKr(lastSavedBalance)} kr
                  </div>
                </div>
                 <div
  style={{
    height: 1,
    background: "rgba(0,0,0,0.08)",
    margin: "16px 0",
  }}
/>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    Jevnt fordelt per dags dato
                  </div>
                  <div style={{ fontSize: 22 }}>
                    {fmtKr(result.safeDaily)} kr
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SALDO INPUT */}
      <section style={{ marginTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Saldo på brukskonto i dag</span>
            <InputInfoTooltip />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Skriv saldo…"
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 20,
                border: "1px solid var(--border-soft)",
                fontSize: 16,
              }}
            />

            <button
              onClick={saveBalanceNow}
              style={{
                padding: "14px 16px",
                borderRadius: 20,
                background: alreadyUpdatedToday
                  ? "rgba(0,0,0,0.05)"
                  : "#62AAC0",
                color: alreadyUpdatedToday ? "#666" : "white",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: alreadyUpdatedToday
                  ? "none"
                  : "0 2px 8px rgba(98,170,192,0.3)",
              }}
            >
              {alreadyUpdatedToday ? "Oppdatert ✓" : "Oppdater"}
            </button>
          </div>
        </div>
      </section>

      {/* HISTORIKK */}
<section style={{ marginTop: 16 }}>
  <div
    style={{
      background: "var(--bg-card)",
      borderRadius: 20,
      padding: 20,
      border: "1px solid var(--border-soft)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    }}
  >
    {/* 👇 Samme stil som saldo-tittel */}
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 12,
      }}
    >
      Saldohistorikk
    </div>

    <HistoryDropdown
      items={history}
      startBalance={monthStartBalance}
    />
  </div>

</section>
    </main>
  );
}
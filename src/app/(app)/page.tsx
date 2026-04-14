"use client";

import { calculateWeek } from "../lib/weekEngine";
import { EmptyStateMissingBudget } from "../components/EmptyStateMissingBudget";
import DailyReminder from "../components/DailyReminder";
import InstallPrompt from "../components/InstallPrompt";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { calculateBudget } from "../lib/budgetEngine";
import type { ISODate } from "../lib/types";
import { PageHeader } from "../components/PageHeader";
import { Tabs } from "../components/Tabs";
import { BudgetSplitCard } from "../components/BudgetSplitCard";
import { PlanProgressBar } from "../components/PlanProgressBar";
import { HistoryDropdown } from "../components/HistoryDropdown";
import { addHistoryEntry, loadHistory, type BalanceEntry } from "../lib/history";

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

/* ========= TOOLTIP ========= */
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
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-flex" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
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
          <circle cx="12" cy="7" r="1.2" fill="var(--icon-muted)" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "120%",
            right: 0,
            width: "min(300px, 85vw)",
            background: "var(--bg-elev-1)",
            color: "var(--text-primary)",
            padding: 16,
            borderRadius: 16,
            boxShadow: "var(--shadow-2)",
            border: "1px solid var(--border-soft)",
            fontSize: 13,
            lineHeight: 1.6,
            zIndex: 10000,
          }}
        >
          Legg inn saldo fra brukskonto hver dag.
          Da ser du hva som er trygt å bruke –
          uten å gå tom før måneden er over.
        </div>
      )}
    </div>
  );
}

/* ========= HOME ========= */
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

    const hasRedirected =
      localStorage.getItem(HAS_REDIRECTED_KEY) === "true";

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

  // 🔄 Oppdater dato automatisk
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(todayISO());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  function saveBalanceNow() {
    const value = Number(balanceInput) || 0;
    const updated = addHistoryEntry(value);

    setHistory(updated);
    setCurrentBalance(value);
    setBalanceInput("");
    setLastUpdatedTime(nowTimeNO());
  }

  const lastSavedBalance = history[0]?.balance ?? currentBalance;

  const alreadyUpdatedToday = history.some(
    (h) => h.date === today
  );

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
  }, [
    monthStartBalance,
    result.plannedDaily,
    lastSavedBalance,
    monthStartDate,
    result.remainingDays,
    today,
  ]);

  if (!result || result.totalDays <= 0) {
    return <EmptyStateMissingBudget />;
  }

  return (
    <main className="page" style={{ maxWidth: 520, margin: "0 auto" }}>
      <InstallPrompt />

      <PageHeader
        title="Slik ligger du an i dag"
        subtitle={fmtDateShortNO(new Date().toISOString())}
      />

      {/* ===== SALDO INPUT ===== */}
      <section style={{ marginTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 700,
            }}
          >
            <span>Saldo på brukskonto i dag</span>
            <InputInfoTooltip />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              inputMode="numeric"
              placeholder="Skriv saldo…"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveBalanceNow();
              }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 14,
                border: "1px solid var(--border-soft)",
                fontSize: 16,
                background: "var(--bg-elev-1)",
              }}
            />

            <button
              onClick={saveBalanceNow}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: alreadyUpdatedToday
                  ? "var(--green-100)"
                  : "var(--accent-safe)",
                color: alreadyUpdatedToday
                  ? "var(--green-700)"
                  : "white",
                fontWeight: 800,
                border: alreadyUpdatedToday
                  ? "1px solid var(--green-300)"
                  : "none",
                cursor: "pointer",
              }}
            >
              {alreadyUpdatedToday ? "Oppdatert i dag ✓" : "Oppdater"}
            </button>
          </div>

          {alreadyUpdatedToday && lastUpdatedTime && (
            <div
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
              }}
            >
              Sist oppdatert kl {lastUpdatedTime}
            </div>
          )}
        </div>
      </section>

      {/* ===== HOVEDKORT ===== */}
      <section className="section">
        <div className="card">
          <div className="cardContent">
            <Tabs value={activeTab} onChange={setActiveTab} />

            {activeTab === "day" && (
              <>
                <BudgetSplitCard
                  titleLeft="Trygt å bruke per dag"
                  titleRight="Ved jevnt forbruk"
                  actual={weekResult.daily}
                  planned={result.plannedDaily}
                />

                
              </>
            )}

            {activeTab === "week" && (
              <>
                <BudgetSplitCard
                  titleLeft="Trygt å bruke i aktiv periode"
                  titleRight="Ved jevnt forbruk"
                  actual={weekResult.daily * weekResult.spanDays}
                  planned={result.plannedDaily * 7}
                />

                
              </>
            )}

            {activeTab === "month" && (
              <>
                <BudgetSplitCard
                  titleLeft="Igjen denne måneden"
                  titleRight="Sum ved lønn"
                  actual={lastSavedBalance}
                  planned={monthStartBalance}
                />

                
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== HISTORIKK ===== */}
      <section className="section sectionDivider">
        <div className="card">
          <div className="cardContent">
            <HistoryDropdown
              items={history}
              startBalance={monthStartBalance}
            />
            <DailyReminder />
          </div>
        </div>
      </section>
    </main>
  );
}

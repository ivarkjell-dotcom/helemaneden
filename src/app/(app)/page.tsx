"use client";

import { EmptyStateMissingBudget } from "../components/EmptyStateMissingBudget";
import DailyReminder from "../components/DailyReminder";
import InstallPrompt from "../components/InstallPrompt";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateBudget } from "../lib/budget";
import type { ISODate } from "../lib/types";

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

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

export default function Home() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("day");
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [history, setHistory] = useState<BalanceEntry[]>([]);
  const [balanceInput, setBalanceInput] = useState<string>("");
  const [saved, setSaved] = useState(false);

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
    if (last) {
      setCurrentBalance(last.balance);
    } else {
      setCurrentBalance(startBalance);
    }

    // 🔁 Automatisk redirect til /settings – kun én gang
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

  function saveBalanceNow() {
    const value = Number(balanceInput) || 0;
    const updated = addHistoryEntry(value);

    setHistory(updated);
    setCurrentBalance(value);
    setBalanceInput("");

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const lastSavedBalance = history[0]?.balance ?? currentBalance;

  const result = useMemo(() => {
    return calculateBudget({
      monthStartBalance,
      currentBalance: lastSavedBalance,
      monthStartDate,
      nextPayday,
      todayISO: todayISO(),
    });
  }, [monthStartBalance, lastSavedBalance, monthStartDate, nextPayday]);

  return (
    <main className="page" style={{ maxWidth: 520, margin: "0 auto" }}>
      {!result || result.totalDaysInPeriod <= 0 ? (
        <EmptyStateMissingBudget />
      ) : (
        <>
          <InstallPrompt />

          {/* ===== HOVEDKORT ===== */}
          <section className="section">
            <div className="card">
              <div className="cardContent">
                <div style={{ marginBottom: "var(--space-m)" }}>
                  <Tabs value={activeTab} onChange={setActiveTab} />
                </div>

                {/* ===== DAG ===== */}
                {activeTab === "day" && (() => {
                  const dayMax = result.plannedDaily;
                  const dayRemaining = result.safeDaily;
                  const dayUsed = dayMax - dayRemaining;
                  const dayDelta = dayRemaining - dayMax;

                  const helper =
                    dayDelta > 0
                      ? `Det har igjen ${fmtKr(dayDelta)} kr mer per dag denne uken enn ved jevnt forbruk.`
                      : dayDelta < 0
                      ? `Du har igjen ${fmtKr(Math.abs(dayDelta))} kr mindre per dag denne uken, enn ved jevnt forbruk.`
                      : `Du følger planen i dag.`;

                  return (
                    <>
                      <BudgetSplitCard
                         titleLeft="Trygt å bruke per dag denne uken"
                        titleRight="Jevn plan"
                        actual={dayRemaining}
                        planned={dayMax}
                        


                      />
                      <PlanProgressBar
                        label="Bruk i forhold til jevnt forbruk"
                        used={dayUsed}
                        max={dayMax}
                        planUsed={dayMax}
                        />

                         <div
                          style={{
                          marginTop: 6,
                          fontSize: 12,
                          lineHeight: 1.4,
                          color: "var(--text-muted)",
                         }}
                         >
                       {helper}
                       </div>

                    </>
                  );
                })()}

                {/* ===== UKE ===== */}
                {activeTab === "week" && (() => {
                  const weekMax = result.plannedWeekBudgetThisWeek;
                  const weekRemaining = result.safeWeek;
                  const weekUsed = weekMax - weekRemaining;
                  const daysElapsed = 7 - result.remainingDaysThisWeek;
                  const weekPlanUsed = result.plannedDaily * daysElapsed;

                  return (
                    <>
                      <BudgetSplitCard
                        titleLeft="Igjen enne uken"
                        titleRight="Jevn plan"
                        actual={weekRemaining}
                        planned={weekMax}
                        deltaLabel=""
                      />
                      <PlanProgressBar
                        label="Forbrukdenne uken"
                        used={weekUsed}
                        max={weekMax}
                        planUsed={weekPlanUsed}
                        showInfo
                      />
                    </>
                  );
                })()}

                {/* ===== MÅNED ===== */}
                {activeTab === "month" && (() => {
                  const monthMax = monthStartBalance;
                  const monthRemaining = currentBalance;
                  const monthUsed = monthMax - monthRemaining;
                  const monthPlanUsed =
                    result.plannedDaily * result.daysElapsed;

                  return (
                    <>
                      <BudgetSplitCard
                        titleLeft="Igjen denne måneden"
                        titleRight="Sum ved lønn"
                        actual={monthRemaining}
                        planned={monthMax}
                        deltaLabel=""
                      />
                      <PlanProgressBar
                        label="Forbruk denne måneden"
                        used={monthUsed}
                        max={monthMax}
                        planUsed={monthPlanUsed}
                        showInfo
                      />
                    </>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* ===== SALDO ===== */}
          <section className="section sectionDivider">
            <div className="card">
              <div className="cardContent">
                <div style={{ fontWeight: 800 }}>Registrer dagens saldo</div>

                <div style={{ display: "flex", gap: "var(--space-s)" }}>
                  <input
                    inputMode="numeric"
                    placeholder="Skriv ny saldo…"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveBalanceNow();
                    }}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.12)",
                      fontSize: 16,
                    }}
                  />
                  <button
                    onClick={saveBalanceNow}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "rgba(0,0,0,0.04)",
                      fontWeight: 800,
                    }}
                  >
                    Lagre
                  </button>
                </div>

                {saved && (
                  <div style={{ fontSize: 12, color: "green", marginTop: 6 }}>
                    Saldo oppdatert ✓
                  </div>
                )}

                <HistoryDropdown
                  items={history}
                  startBalance={monthStartBalance}
                />

                <DailyReminder />
              </div>
            </div>
          </section>

          <section className="section">
            <a
              href="/settings"
              style={{ textAlign: "center", opacity: 0.75, fontSize: 13 }}
            >
              Endre lønn / datoer →
            </a>
          </section>
        </>
      )}
    </main>
  );
}

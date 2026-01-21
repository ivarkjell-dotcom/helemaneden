"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { calculateDaysBetween } from "./lib/budget";

export default function Home() {
  /* =========================
     STATE (lagres)
  ========================= */
  const [monthStartBalance, setMonthStartBalance] = useState(15000);
  const [monthStartDate, setMonthStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [nextPayday, setNextPayday] = useState("2026-02-01");
  const [dailyBalance, setDailyBalance] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day");
  const [isEditing, setIsEditing] = useState(false);

  /* =========================
     LOAD FROM localStorage
  ========================= */
  useEffect(() => {
    const b = localStorage.getItem("monthStartBalance");
    const s = localStorage.getItem("monthStartDate");
    const p = localStorage.getItem("nextPayday");
    const d = localStorage.getItem("dailyBalance");

    if (b) setMonthStartBalance(Number(b));
    if (s) setMonthStartDate(s);
    if (p) setNextPayday(p);
    if (d) setDailyBalance(Number(d));
  }, []);

  /* =========================
     TIME
  ========================= */
  const today = new Date();

  const isSunday = today.getDay() === 0;


  const daysLeft = Math.max(
    1,
    calculateDaysBetween(today, new Date(nextPayday))
  );

  const daysSinceStart = Math.max(
    0,
    calculateDaysBetween(new Date(monthStartDate), today)
  );

  const totalDaysInPeriod = Math.max(
  1,
  calculateDaysBetween(
    new Date(monthStartDate),
    new Date(nextPayday)
  )
);


  /* =========================
     PLAN – GRUNN
  ========================= */
  const dailyPlan = Math.floor(
  monthStartBalance / totalDaysInPeriod
);

const weeklyPlan = dailyPlan * 7;


  /* =========================
     FAKTISK FORBRUK
  ========================= */
  const actualSpent =
    dailyBalance !== null ? monthStartBalance - dailyBalance : null;

  const plannedSpentUntilNow = dailyPlan * daysSinceStart;

  const planDelta =
    actualSpent !== null ? plannedSpentUntilNow - actualSpent : null;

  /* =========================
     UKELOGIKK (din modell)
     - Dagavvik → resten av uken
     - Ukeavvik → kun neste uke
  ========================= */
  const dayOfWeek = today.getDay(); // 0 = søndag
  const daysLeftThisWeek = Math.max(1, 7 - dayOfWeek);
  const weekProgress =
  1 - daysLeftThisWeek / 7;


  const adjustedWeekRemaining =
    planDelta !== null
      ? Math.max(0, weeklyPlan + planDelta)
      : weeklyPlan;

  const todayAvailable =
    activeTab === "day"
      ? Math.floor(adjustedWeekRemaining / daysLeftThisWeek)
      : activeTab === "week"
      ? adjustedWeekRemaining
      : monthStartBalance;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ marginBottom: 24 }}>
  HeleMåneden
</h1>

        {!isEditing ? (
        
          <div className={styles.content}>
  <div className={styles.contentStack}>
    <section className={styles.card}>
      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <button
          className={`${styles.tab} ${
            activeTab === "day" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("day")}
        >
          Dag
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "week" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("week")}
        >
          Uke
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "month" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("month")}
        >
          Måned
        </button>
      </div>

      <p className={`${styles.cardTitle} ${styles.fade}`}>

        {activeTab === "day" && "I dag kan du bruke"}
        {activeTab === "week" && "Denne uken kan du bruke"}
        {activeTab === "month" && "Ved lønn hadde du"}
      </p>

      <p className={`${styles.cardAmount} ${styles.fade}`}>
  {todayAvailable} kr
</p>


      <p className={styles.cardMeta}>
        {daysLeft} dager igjen til lønn
      </p>

      <div
        aria-hidden
        style={{
          marginTop: 12,
          height: 4,
          width: "100%",
          background: "var(--bg-muted)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.round(weekProgress * 100)}%`,
            background: "var(--accent-primary)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {isSunday && (
        <p
          className={styles.cardMeta}
          style={{ fontSize: 12 }}
        >
          Ny uke starter i morgen
        </p>
      )}

      {planDelta !== null && (
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color:
              planDelta > 300
                ? "var(--accent-positive)"
                : planDelta < -300
                ? "var(--accent-warning)"
                : "var(--text-muted)",
          }}
        >
          {planDelta > 300 && "Du er i rute 👍"}
          {planDelta <= 300 && planDelta >= -300 && "Det er litt stramt i dag"}
          {planDelta < -300 &&
            `Du har brukt ${Math.abs(Math.round(planDelta))} kr mer enn planen`}
        </p>
      )}
    </section>

    {/* Saldo i dag */}
    <div className={styles.cardBelow}>
      <label className={styles.label}>
        Saldo på bankkonto
        <input
          className={styles.input}
          type="number"
          placeholder="Hva står på konto akkurat nå?"
          value={dailyBalance ?? ""}
          onChange={(e) => {
            const value =
              e.target.value === "" ? null : Number(e.target.value);
            setDailyBalance(value);

            value === null
              ? localStorage.removeItem("dailyBalance")
              : localStorage.setItem("dailyBalance", value.toString());
          }}
        />
      </label>

      <p className={styles.metaHint}>
        Påvirker kun resten av uken – ikke hele måneden.
      </p>
    </div>
  </div>

  <button
    onClick={() => setIsEditing(true)}
    className={styles.saveButton}
  >
    Endre måneds saldo
  </button>
</div>

        ) : (
          <>
          <div className={styles.content}>
            <section className={styles.edit}>
              <label className={styles.label}>
                Saldo ved lønn
                <input
                  className={styles.input}
                  type="number"
                  value={monthStartBalance}
                  onChange={(e) =>
                    setMonthStartBalance(Number(e.target.value))
                  }
                />
              </label>

              <label className={styles.label}>
                Lønnsdato / startdato
                <input
                  className={styles.input}
                  type="date"
                  value={monthStartDate}
                  onChange={(e) => setMonthStartDate(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Neste lønnsdato
                <input
                  className={styles.input}
                  type="date"
                  value={nextPayday}
                  onChange={(e) => setNextPayday(e.target.value)}
                />
              </label>

              <button
                className={styles.saveButton}
                onClick={() => {
                  localStorage.setItem(
                    "monthStartBalance",
                    monthStartBalance.toString()
                  );
                  localStorage.setItem("monthStartDate", monthStartDate);
                  localStorage.setItem("nextPayday", nextPayday);
                  setIsEditing(false);
                }}
              >
                Ferdig
              </button>
            </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

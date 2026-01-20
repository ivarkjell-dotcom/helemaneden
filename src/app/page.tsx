"use client";

import { useState } from "react";
import styles from "./page.module.css";

import {
  calculateDaysLeft, 
  calculateBudget,
  calculateDaysLeftInWeek,
} from "./lib/budget";

export default function Home() {
  const [balance, setBalance] = useState(9000);
  const [nextPayday, setNextPayday] = useState("2026-02-01");
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day");


  const daysLeft = calculateDaysLeft(new Date(nextPayday));
 const daysLeftInWeek = calculateDaysLeftInWeek(new Date(nextPayday));


const budget = calculateBudget({
  currentBalance: balance,
  daysLeftInMonth: daysLeft,
  daysLeftInWeek,
});

function getWeekLabel(nextPayday: string) {
  const today = new Date();
  const payday = new Date(nextPayday);

  const dayNames = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];

  const startDay = dayNames[today.getDay()];

  // Finn siste dag i uke (søndag eller før lønn)
  const endDate = payday < new Date(today.getTime() + 7 * 86400000)
    ? new Date(payday.getTime() - 86400000)
    : new Date(today.getTime() + (6 - today.getDay()) * 86400000);

  const endDay = dayNames[endDate.getDay()];

  return `${startDay}–${endDay}`;
}


  return (
  <main style={{ padding: 24, maxWidth: 420 }}>
    <h1 style={{ marginBottom: 24 }}>HeleMåneden</h1>

    {!isEditing ? (
      // ===== HOME =====
      <>
        <section
          style={{
            padding: "24px 32px",
            borderRadius: 16,
            background: "#f2f4f7",
            textAlign: "left",
          }}
        >
 {/* ===== TAPBAR ===== */}
<div className={styles.tabsWrapper}>
  <button
    onClick={() => setActiveTab("day")}
    className={`${styles.tab} ${
      activeTab === "day" ? styles.activeTab : ""
    }`}
  >
    Dag
  </button>

  <button
    onClick={() => setActiveTab("week")}
    className={`${styles.tab} ${
      activeTab === "week" ? styles.activeTab : ""
    }`}
  >
    Uke
  </button>

  <button
    onClick={() => setActiveTab("month")}
    className={`${styles.tab} ${
      activeTab === "month" ? styles.activeTab : ""
    }`}
  >
    Måned
  </button>
</div>



        <p className={styles.cardTitle}>
  {activeTab === "day" && "I dag kan du bruke"}
  {activeTab === "week" && "Denne uken kan du bruke"}
  {activeTab === "month" && "Til neste lønn kan du bruke"}
</p>




         <p className={styles.cardAmount}>
  {activeTab === "day" && `${budget.dailyAvailable} kr`}
  {activeTab === "week" && `${budget.weeklyAvailable} kr`}
  {activeTab === "month" && `${budget.monthlyAvailable} kr`}
</p>






          <p className={styles.cardMeta}>
  {daysLeft} dager igjen til lønn
</p>

        </section>

        <button
          onClick={() => setIsEditing(true)}
          style={{
            marginTop: 32,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ccc",
            background: "white",
            color: "#111",
            cursor: "pointer",
          }}
        >
          Endre saldo eller lønnsdato
        </button>
      </>
    ) : (
      // ===== JUSTER =====
      
  <>
  <h2 style={{ marginBottom: 16 }}>Juster</h2>

  <section className={styles.edit}>
    <label className={styles.label}>
      Saldo på konto
      <input
        className={styles.input}
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
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
  </section>


  <button
    onClick={() => setIsEditing(false)}
    style={{
      marginTop: 24,
      width: "100%",
      padding: 12,
      borderRadius: 12,
      border: "none",
      background: "#111",
      color: "white",
      cursor: "pointer",
    }}
  >
    Ferdig
  </button>
</>

    )}
  </main>
);




}

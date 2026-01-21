"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.css";


import {
  calculateDaysLeft, 
} from "./lib/budget";


import { calculateDaysBetween } from "./lib/budget";


export default function Home() {
  const [monthStartBalance, setMonthStartBalance] = useState(12000);
  const [nextPayday, setNextPayday] = useState("2026-02-01");

  const [monthStartDate, setMonthStartDate] = useState(
  new Date().toISOString().slice(0, 10)
);


  const [isEditing, setIsEditing] = useState(false);
 const [isMonthLocked, setIsMonthLocked] = useState(false);
   const [dailyBalance, setDailyBalance] = useState<number | null>(null);

useEffect(() => {
  const saved = localStorage.getItem("dailyBalance");
  if (saved) {
    setDailyBalance(Number(saved));
  }
}, []);




  const [activeTab, setActiveTab] = useState<"day" | "week" | "month">("day");


  const daysLeft = calculateDaysBetween(
  new Date(monthStartDate),
  new Date(nextPayday)
);


const dailyAvailable =
  daysLeft > 0 ? Math.floor(monthStartBalance / daysLeft) : 0;
const dailyDelta =
  dailyBalance !== null ? dailyBalance - dailyAvailable : null;





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
  {activeTab === "day" && `${dailyAvailable} kr`}
  {activeTab === "week" && `${dailyAvailable * 7} kr`}
  {activeTab === "month" && `${monthStartBalance} kr`}

</p>






        <p className={styles.cardMeta}>
  {daysLeft} dager igjen til lønn
</p>

{dailyDelta !== null && (
  <p
    style={{
      marginTop: 8,
      fontSize: 14,
      color: dailyDelta >= 0 ? "#2e7d32" : "#c62828",
    }}
  >
    {dailyDelta >= 0
      ? `Du ligger ${dailyDelta} kr foran planen`
      : `Du ligger ${Math.abs(dailyDelta)} kr bak planen`}
  </p>
)}


        </section>

<div style={{ marginTop: 16 }}>
  <label className={styles.label}>
    <span style={{ color: "#555" }}>Saldo i dag</span>
    <input
      className={styles.input}
      type="number"
      placeholder="Hva står på konto akkurat nå?"
      value={dailyBalance ?? ""}
      onChange={(e) => {
  const value = e.target.value === "" ? null : Number(e.target.value);
  setDailyBalance(value);

  if (value !== null) {
    localStorage.setItem("dailyBalance", value.toString());
  } else {
    localStorage.removeItem("dailyBalance");
  }
}}

    />
  </label>
</div>

<p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
  Påvirker ikke planen – kun for å se hvordan du ligger an.
</p>


        <button
       onClick={() => {
       setIsEditing(true);
       setIsMonthLocked(false);
  }}
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
          Endre måneds saldo
        </button>
      </>
    ) : (
      // ===== JUSTER =====
      
  <>
  <h2 style={{ marginBottom: 16 }}>Juster</h2>

  <section className={styles.edit}>
    <label className={styles.label}>
      Saldo ved lønn
      <input
  className={styles.input}
  type="number"
  value={monthStartBalance}
  disabled={isMonthLocked}
  onChange={(e) =>
    setMonthStartBalance(Number(e.target.value))
  }
/>

<label className={styles.label}>
  Lønnsdato / startdato
  <input
    className={styles.input}
    type="date"
    value={monthStartDate}
    onChange={(e) => setMonthStartDate(e.target.value)}
  />
</label>


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
  onClick={() => {
    setIsEditing(false);
    setIsMonthLocked(true);
  }}
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

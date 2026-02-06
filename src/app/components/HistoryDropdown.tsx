"use client";

import { useState } from "react";
import type { BalanceEntry } from "../lib/history";
import type { ISODate } from "../lib/types";

function fmtDate(iso: ISODate) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(iso));
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

function isSameMonth(a: ISODate, b: ISODate) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth();
}

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

export function HistoryDropdown({
  items,
  startBalance,
}: {
  items: BalanceEntry[];
  startBalance: number;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"current" | "previous">("current");

  if (!items || items.length === 0) return null;

  const latest = items[0];
  const today = todayISO();

  const currentMonth = items.filter(
  (i) =>
    isSameMonth(i.date, today) &&
    i.label !== "Startsaldo etter lønn"
);

  const previousMonth = items.filter((i) => !isSameMonth(i.date, today));

  return (
    <div style={{ marginTop: 12 }}>
      {/* Header */}
      <div
        onClick={() => {
          setOpen(!open);
          setView("current");
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          fontWeight: 700,
          alignItems: "center",
        }}
        aria-expanded={open}
      >
        <span>Saldo i dag</span>
        <span style={{ fontSize: 18 }}>{open ? "⌃" : "⌄"}</span>
      </div>

      {/* Latest balance */}
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
        {fmtKr(latest.balance)} kr
      </div>

      {open && (
        <div style={{ marginTop: 12 }}>
          {view === "current" && (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: 0.7,
                  marginBottom: 6,
                }}
              >
                Denne måneden
              </div>

              {/* ✅ Startsaldo etter lønn (samme som Saldo ved lønn start) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontWeight: 600 }}>Startsaldo etter lønn</span>
                <span>{fmtKr(startBalance)} kr</span>
              </div>

              {currentMonth.slice(0, 5).map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {h.label ?? fmtDate(h.date)}
                  </span>
                  <span>{fmtKr(h.balance)} kr</span>
                </div>
              ))}

              {previousMonth.length > 0 && (
                <button
                  onClick={() => setView("previous")}
                  style={{
                    marginTop: 10,
                    background: "none",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: 0,
                  }}
                >
                  Forrige måned ▸
                </button>
              )}
            </>
          )}

          {view === "previous" && (
            <>
              <button
                onClick={() => setView("current")}
                style={{
                  marginBottom: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                ← Tilbake
              </button>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: 0.7,
                  marginBottom: 6,
                }}
              >
                Forrige måned
              </div>

              {previousMonth.slice(0, 10).map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    padding: "6px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {h.label ?? fmtDate(h.date)}
                  </span>
                  <span>{fmtKr(h.balance)} kr</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

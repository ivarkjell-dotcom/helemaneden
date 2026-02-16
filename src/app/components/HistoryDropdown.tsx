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
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth()
  );
}

function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

/* 🔽 Chevron icon (matcher stroke-fargene i appen) */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--icon-muted)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
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

  const today = todayISO();

  const currentMonth = items.filter(
    (i) =>
      isSameMonth(i.date, today) &&
      i.label !== "Startsaldo etter lønn"
  );

  const previousMonth = items.filter(
    (i) => !isSameMonth(i.date, today)
  );

  return (
    <div style={{ marginTop: 12 }}>
      {/* Header */}
      <button
        onClick={() => {
          setOpen(!open);
          setView("current");
        }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 14,
          color: "var(--text-primary)",
        }}
        aria-expanded={open}
      >
        <span>Saldohistorikk</span>
        <Chevron open={open} />
      </button>

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

              {/* Startsaldo */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  Startsaldo etter lønn
                </span>
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
                    borderBottom: "1px solid var(--border-soft)",
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
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: 0,
                  }}
                >
                  Se forrige måned →
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
                  color: "var(--text-secondary)",
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
                    borderBottom: "1px solid var(--border-soft)",
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

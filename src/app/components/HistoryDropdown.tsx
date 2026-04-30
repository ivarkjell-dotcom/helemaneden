"use client";

import { useState } from "react";
import type { BalanceEntry } from "../lib/history";
import type { ISODate } from "../lib/types";

function fmtDate(iso: ISODate) {
  const d = new Date(iso);

  const day = d.getDate();
  const month = d.getMonth() + 1;

  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}`;
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

function formatPeriodLabel(start: ISODate, end: ISODate) {
  const format = (iso: ISODate) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  return `${format(start)} – ${format(end)}`;
}



function todayISO(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

export function HistoryDropdown({
  items,
  startBalance,
  periodStart,
  periodEnd,
}: {
  items: BalanceEntry[];
  startBalance: number;
  periodStart: ISODate;
  periodEnd: ISODate;
})
{
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"current" | "previous">("current");

  if (!items || items.length === 0) return null;

  

  const currentPeriod = items.filter(
  (i) => i.date >= periodStart && i.date <= periodEnd
);

const previousPeriod = items.filter(
  (i) => i.date < periodStart
);

  const latest = items[0] ?? { balance: 0, date: todayISO() };

  return (
    <div style={{ marginTop: 12 }}>
      {/* HEADER */}
      <button
        onClick={() => {
          setOpen(!open);
          setView("current");
        }}
        style={{
          width: "100%",
          background: "transparent", // 👈 fjernet kort-følelse
          border: "none", // 👈 fjernet ramme
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {/* Venstre */}
        <div>
          <div style={{ fontSize: 12, opacity: 0.6, textAlign: "left" }}>
            Sist oppdatert
          </div>

          <div style={{ fontWeight: 700 }}>
            {fmtDate(latest.date)}
            {latest.time && (
              <span style={{ fontSize: 12, opacity: 0.6, marginLeft: 14 }}>
                kl {latest.time}
              </span>
            )}
          </div>
        </div>

        {/* Høyre */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            Saldo konto
          </div>

          <div style={{ fontWeight: 700 }}>
            {fmtKr(latest.balance)} kr
          </div>
        </div>

        {/* Chevron */}
        <div
          style={{
            marginLeft: 12,
            width: 32,
            height: 32,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke="#62AAC0"
            fill="none"
            strokeWidth="2"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div style={{ marginTop: 12 }}>
          {view === "current" && (
            <>
            <div
  style={{
    height: 1,
    background: "rgba(0,0,0,0.08)",
    margin: "16px 0",
  }}
/>
              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 6 }}>
  Periode {formatPeriodLabel(periodStart, periodEnd)}
</div>

              <div style={{ padding: "6px 0" }}>
                <strong>Startsaldo</strong> {fmtKr(startBalance)} kr
              </div>

              {currentPeriod.map((h, i) => (
  <div
    key={i}
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      padding: "6px 0",
    }}
  >
    <span>{h.label ?? fmtDate(h.date)}</span>
    <span>{fmtKr(h.balance)} kr</span>
  </div>
))}

              {previousPeriod.length > 0 && (
                <button
                  onClick={() => setView("previous")}
                  style={{
                    marginTop: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    opacity: 0.6,
                  }}
                >
                  Se forrige periode →
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
                  opacity: 0.6,
                }}
              >
                ← Tilbake
              </button>

              <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 6 }}>
      Forrige periode
    </div>

              {previousPeriod.slice(0, 10).map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    padding: "6px 0",
                  }}
                >
                  <span>{h.label ?? fmtDate(h.date)}</span>
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
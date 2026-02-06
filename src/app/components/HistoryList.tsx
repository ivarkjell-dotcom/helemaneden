"use client";

import React from "react";
import type { BalanceEntry } from "../lib/history";
import type { ISODate } from "../lib/types";

function fmtDate(iso: ISODate) {
  return new Intl.DateTimeFormat("nb-NO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

export function HistoryList({ items }: { items: BalanceEntry[] }) {
  if (!items.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7, marginBottom: 6 }}>
        Historikk (saldo-input)
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.slice(0, 8).map((h) => (
          <div
            key={h.date}   // ✅ riktig key
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {fmtDate(h.date)}
              {h.label && ` · ${h.label}`}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800 }}>
              {fmtKr(h.balance)} kr
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


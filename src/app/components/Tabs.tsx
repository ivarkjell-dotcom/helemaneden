"use client";

import React from "react";

type TabKey = "day" | "week" | "month";

export function Tabs({
  value,
  onChange,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  const items: { key: TabKey; label: string }[] = [
    { key: "day", label: "Dag" },
    { key: "week", label: "Uke" },
    { key: "month", label: "Måned" },
  ];

  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        alignItems: "flex-end",
        width: "100%",
      }}
    >
      {items.map((t, index) => {
        const active = t.key === value;

        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              flex: 1,
              padding: "14px 10px",
              cursor: "pointer",

              borderRadius: "18px 18px 0 0",

              /* 🔥 Overlap */
              marginLeft: index === 0 ? 0 : -14,

              /* 🔥 Border (ingen shorthand) */
              borderTop: "1px solid rgba(0,0,0,0.08)",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              borderRight: "1px solid rgba(0,0,0,0.08)",
              borderBottom: active
                ? "none"
                : "1px solid rgba(0,0,0,0.08)",

              /* 🔥 Bakgrunn */
              background: active
                ? "var(--bg-card)"
                : "#F3F4F6",

              /* 🔥 STACKING (helt stabil nå) */
              position: "relative",
              zIndex: active ? 999 : 100 - index,

              /* 🔥 Løft */
              marginTop: active ? 0 : 6,

              /* Tekst */
              color: active ? "#111" : "rgba(0,0,0,0.5)",
              fontWeight: active ? 700 : 500,
              fontSize: active ? 16 : 14,

              transition: "all 0.18s ease",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
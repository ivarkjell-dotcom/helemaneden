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
        width: "100%",
        gap: 8,
        position: "relative",
        zIndex: 2,
      }}
    >
      {items.map((t) => {
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

              /* 🎨 FARGE */
              background: active
                ? "var(--bg-app)"   // samme som kort
                : "var(--bg-sunken)",

              /* 🧱 BORDER (ingen shorthand!) */
              borderTop: "1px solid var(--border-soft)",
              borderLeft: "1px solid var(--border-soft)",
              borderRight: "1px solid var(--border-soft)",
              borderBottom: active
                ? "none"
                : "1px solid var(--border-soft)",

              /* 🧠 LAG */
              position: "relative",
              zIndex: active ? 10 : 1,

              /* 🔥 SMELT INN I KORT */
              marginBottom: active ? -2 : 0,

              /* ✍️ TEKST */
              color: active
                ? "var(--text-primary)"
                : "var(--text-muted)",

              fontWeight: active ? 700 : 500,
              fontSize: 14,

              transition: "all 0.15s ease",

              /* 🔧 PIXEL FINJUST (valgfri men bra) */
              transform:
                t.key === "day"
                  ? "translateX(-1px)"
                  : t.key === "month"
                  ? "translateX(1px)"
                  : "none",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
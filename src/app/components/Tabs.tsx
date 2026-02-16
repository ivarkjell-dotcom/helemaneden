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
      aria-label="Visning"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 6,
        padding: 6,
        borderRadius: 100,
        background: "var(--tab-bg, rgba(0,0,0,0.04))",
      }}
    >
      {items.map((t) => {
        const active = t.key === value;

        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.key)}
            style={{
              padding: "10px 12px",
              borderRadius: 999,
              border: active
                ? "2px solid var(--accent-safe)"
                : "2px solid transparent",
              background: active
                ? "var(--accent-soft)"
                : "transparent",
              color: active
                ? "var(--text-primary)"
                : "var(--text-secondary)",
              fontWeight: active ? 700 : 600,
              transition: "all 0.15s ease",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

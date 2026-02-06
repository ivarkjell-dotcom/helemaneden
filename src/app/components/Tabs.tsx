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
        gap: 8,
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
              borderRadius: 12,
              border: active ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(0,0,0,0.08)",
              background: active ? "rgba(0,0,0,0.04)" : "white",
              fontWeight: 600,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

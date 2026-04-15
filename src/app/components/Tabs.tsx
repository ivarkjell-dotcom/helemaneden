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
    <>
      {/* Tabs */}
      <div
        role="tablist"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          paddingLeft: 4,
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
                padding: "12px 10px",
                cursor: "pointer",

                /* ✨ FORM */
                borderRadius: "20px 20px 0 0",

                /* ✨ BORDER (kun topp + sider når aktiv) */
                borderTop: active ? "1.5px solid rgba(0,0,0,0.06)" : "none",
borderLeft: active ? "1.5px solid rgba(0,0,0,0.06)" : "none",
borderRight: active ? "1.5px solid rgba(0,0,0,0.06)" : "none",
                borderBottom: "none",

                /* ✨ BAKGRUNN */
                background: active
                  ? "var(--bg-card)"
                  : "rgba(0,0,0,0.03)",

                position: "relative",
                zIndex: active ? 2 : 1,

                /* ✨ TEKST */
                color: active
                  ? "#111"
                  : "rgba(0,0,0,0.45)",

                fontWeight: active ? 700 : 500,
                fontSize: active ? 16 : 14,

                /* ✨ LØFT */
                transform: active ? "translateY(1px)" : "none",

                boxShadow: "none",
                transition: "all 0.18s ease",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      
    </>
  );
}
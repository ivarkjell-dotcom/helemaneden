"use client";

import React, { useState, useRef, useEffect } from "react";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="#555" strokeWidth="2" />
      <line x1="12" y1="10" x2="12" y2="16" stroke="#555" strokeWidth="2" />
      <circle cx="12" cy="7" r="1.2" fill="#555" />
    </svg>
  );
}

export function PlanProgressBar({
  used,
  max,
  planUsed,
  label,
  showInfo = false,
}: {
  used: number;
  max: number;
  planUsed: number;
  label: string;
  showInfo?: boolean;
}) {
  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
  const safeMax = max > 0 ? max : 1;

  let usedPct = clamp01(used / safeMax);
  const planPct = clamp01(planUsed / safeMax);

  // ✅ UX-fiks: hvis du ligger i pluss → vis grønn bar med minimum bredde
  if (used <= 0) {
    usedPct = 0.05; // 5% synlig grønn bar
  }

  let barColor = "#4CAF50"; // grønn default

  if (usedPct > planPct && usedPct < 1) barColor = "#FFC107"; // gul
  if (usedPct >= 1) barColor = "#F44336"; // rød

  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div style={{ marginTop: 14 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          opacity: 0.9,
        }}
      >
        <span>{label}</span>

        {showInfo && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowTooltip((v) => !v)}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <InfoIcon />
            </button>

            {showTooltip && (
              <div
                ref={tooltipRef}
                style={{
                  position: "absolute",
                  right: 0,
                  top: -100,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 10,
                  padding: 12,
                  width: 240,
                  fontSize: 12,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                  zIndex: 9999,
                }}
              >
                <strong>Punkt ved jevnt forbruk</strong>
                <p style={{ marginTop: 6, lineHeight: 1.4 }}>
                  Fyll viser hvor mye du faktisk har brukt.
                  Streken viser hvor langt du burde vært hvis du bruker penger jevnt.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progressbar */}
      <div
        style={{
          position: "relative",
          height: 12,
          borderRadius: 999,
          background: "rgba(0,0,0,0.08)",
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${usedPct * 100}%`,
            background: barColor,
            transition: "width 0.3s ease",
          }}
        />

        {/* Plan-markør */}
        <div
          style={{
            position: "absolute",
            left: `calc(${planPct * 100}% - 1px)`,
            top: 0,
            bottom: 0,
            width: 2,
            background: "rgba(0,0,0,0.6)",
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  label: string;
  used: number;
  max: number;
  planUsed?: number;
  showInfo?: boolean;
};

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

/* ℹ️ Lite info-ikon */
function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--icon-muted)"
        strokeWidth="2"
      />
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="16"
        stroke="var(--icon-muted)"
        strokeWidth="2"
      />
      <circle cx="12" cy="7" r="1.2" fill="var(--icon-muted)" />
    </svg>
  );
}

export function PlanProgressBar({
  label,
  used,
  max,
  planUsed,
  showInfo = false,
}: Props) {
  const progress = max > 0 ? clamp(used / max) : 0;
  const planProgress =
    planUsed !== undefined && max > 0
      ? clamp(planUsed / max)
      : null;

  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  /* Lukk tooltip ved klikk utenfor */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        <span>{label}</span>

        {showInfo && (
          <div style={{ position: "relative" }} ref={tooltipRef}>
            <button
              type="button"
              aria-label="Forklaring"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              style={{
                border: "none",
                background: "none",
                padding: 2,
                cursor: "pointer",
              }}
            >
              <InfoIcon />
            </button>

            {open && (
              <div
                role="tooltip"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 240,
                  padding: 12,
                  borderRadius: 12,
                  background: "var(--tooltip-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-soft)",
                  boxShadow: "var(--shadow-elevated)",
                  fontSize: 12,
                  lineHeight: 1.4,
                  zIndex: 1000,
                }}
              >
                <strong>Pilen viser jevnt forbruk</strong>
                <p style={{ marginTop: 6 }}>
                  Fyll viser hvor mye du faktisk har brukt.
                  Pilen viser hvor du burde vært nå hvis forbruket
                  er jevnt fordelt i perioden.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress wrapper (tillater pil over baren) */}
      <div
        style={{
          position: "relative",
          paddingTop: 14, // plass til pil
        }}
      >
        {/* 🔺 Pil – jevnt forbruk */}
        {showInfo && planProgress !== null && (
          <div
  style={{
    position: "absolute",
    left: `${planProgress * 100}%`,
    top: 0,
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "7px solid transparent",
    borderRight: "7px solid transparent",
    borderTop: "10px solid var(--border-strong)", // 👈 peker NED
  }}
  aria-hidden
/>

        )}

        {/* Selve progresjonsstripen */}
        <div className="progress">
          <div
            className="fill"
            style={{
              width: `${progress * 100}%`,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Forklaring under baren */}
      {showInfo && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Pilen viser et jevnt forbruk.
          Større kjøp tidligere i perioden kan gi lavere saldo nå, uten at det betyr at noe er galt.
        </div>
      )}
    </div>
  );
}

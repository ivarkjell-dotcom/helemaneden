"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--icon-muted)" strokeWidth="2" />
      <line x1="12" y1="10" x2="12" y2="16" stroke="var(--icon-muted)" strokeWidth="2" />
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
  // Sørger for at used aldri blir negativ
  const safeUsed = Math.max(0, used);

  const progress = max > 0 ? clamp(safeUsed / max) : 0;
  const planProgress =
    planUsed !== undefined && max > 0 ? clamp(planUsed / max) : null;

  const [open, setOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const iconRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setPortalReady(true), []);

  /* Lukk ved klikk utenfor + ESC */
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (tooltipRef.current?.contains(target)) return;
      if (iconRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  /* Tooltip-posisjon */
  const tooltipPos = useMemo(() => {
    if (!open || !iconRef.current) return null;

    const rect = iconRef.current.getBoundingClientRect();

    return {
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
    };
  }, [open]);

  const tooltip =
    portalReady && open && tooltipPos
      ? createPortal(
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99998,
                background: "transparent",
              }}
            />

            <div
              ref={tooltipRef}
              style={{
                position: "fixed",
                top: tooltipPos.top,
                left: tooltipPos.left,
                transform: "translateY(-50%)",
                zIndex: 99999,
                backgroundColor: "#ffffff",
                borderRadius: 18,
                padding: 18,
                boxShadow: "0 30px 70px rgba(0,0,0,0.25)",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 14,
                lineHeight: 1.5,
                maxWidth: 340,
                width: "min(340px, calc(100vw - 32px))",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  borderRight: "10px solid #ffffff",
                }}
              />

              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                Pilen viser jevnt forbruk
              </div>

              <div>
                Fyll viser hvor mye du faktisk har brukt.
                Pilen viser hvor du burde vært nå hvis forbruket
                er jevnt fordelt i perioden.
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-secondary)",
        }}
      >
        <span>{label}</span>

        {showInfo && (
          <button
            ref={iconRef}
            onClick={() => setOpen((o) => !o)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon />
          </button>
        )}
      </div>

      {/* Progress */}
      <div style={{ position: "relative", paddingTop: 14 }}>
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
              borderTop: "10px solid var(--border-strong)",
            }}
          />
        )}

        <div className="progress">
          <div
            className="fill"
            style={{
              width: `${progress * 100}%`,
              background:
                safeUsed > 0
                  ? "#F59E0B"  // 🟡 Gul
                  : "#2F7D5F", // 🟢 Grønn
            }}
          />
        </div>
      </div>

      {tooltip}
    </div>
  );
}

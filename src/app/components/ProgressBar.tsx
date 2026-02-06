"use client";

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Label */}
      <div
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: "rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Faktisk forbruk */}
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--green-300), var(--green-500))",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />

        {/* Plan-markør */}
        {showInfo && planProgress !== null && (
          <div
            style={{
              position: "absolute",
              left: `${planProgress * 100}%`,
              top: -4,
              bottom: -4,
              width: 2,
              background: "rgba(0,0,0,0.35)",
              borderRadius: 1,
            }}
          />
        )}
      </div>

      {/* Forklaring (kun der det gir verdi) */}
      {showInfo && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Punktet viser jevnt forbruk i perioden
        </div>
      )}
    </div>
  );
}

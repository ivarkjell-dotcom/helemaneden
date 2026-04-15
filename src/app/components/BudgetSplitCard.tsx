"use client";

type Props = {
  titleLeft: string;
  titleRight?: string;
  actual: number;
  planned?: number;
  deltaLabel?: string;
  compact?: boolean;
};

function fmtKr(n: number) {
  return new Intl.NumberFormat("nb-NO").format(Math.round(n));
}

export function BudgetSplitCard({
  titleLeft,
  titleRight = "Plan",
  actual,
  planned,
  deltaLabel,
  compact = false,
}: Props) {
  return (
    <div
      style={{
        background: compact ? "rgba(0,0,0,0.02)" : "var(--bg-card)", // 👈 NY
        borderRadius: 20,
        padding: compact ? "14px 16px" : "24px 24px 20px", // 👈 JUSTERT
        border: "1px solid var(--border-soft)",
        boxShadow: compact ? "none" : "0 10px 30px rgba(0,0,0,0.06)", // 👈 VIKTIG
        display: "flex",
        flexDirection: "column",
        gap: 10, // litt strammere
      }}
    >
      {/* Topptekst */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Venstre */}
        <div
          style={{
            fontSize: compact ? 13 : 14, // 👈 litt mindre i compact
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {titleLeft}
        </div>

        {/* Høyre */}
        {planned !== undefined && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {titleRight}
            </span>

            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              {fmtKr(planned)} kr
            </span>
          </div>
        )}
      </div>

      {/* Beløp */}
      <div
        style={{
          fontSize: compact ? 22 : 40, // 👈 TYDELIG forskjell
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "var(--accent-safe)",
          lineHeight: 1.1,
        }}
      >
        {fmtKr(actual)} kr
      </div>

      {/* Forklaring */}
      {deltaLabel && (
        <div
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.4,
          }}
        >
          {deltaLabel}
        </div>
      )}
    </div>
  );
}
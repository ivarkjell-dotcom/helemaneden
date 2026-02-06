"use client";

type Props = {
  titleLeft: string;
  titleRight?: string;
  actual: number;
  planned?: number;
  deltaLabel?: string;
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
}: Props) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 20,
        padding: "24px 24px 20px",
        border: "1px solid var(--border-soft)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Topptekst */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {titleLeft}
        </div>

        {planned !== undefined && (
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            {titleRight}{" "}
            <span style={{ fontWeight: 600 }}>
              {fmtKr(planned)} kr
            </span>
          </div>
        )}
      </div>

      {/* Hovedbeløp */}
      <div
        style={{
          fontSize: 40,
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
            fontSize: 14,
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

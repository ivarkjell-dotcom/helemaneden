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
        background: "var(--bg-card)",
        borderRadius: 20,
        padding: compact ? "16px" : "24px 24px 20px",
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
    alignItems: "flex-start",
  }}
>
  {/* Venstre side */}
  <div
    style={{
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-secondary)",
    }}
  >
    {titleLeft}
  </div>

  {/* Høyre side */}
  {planned !== undefined && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",   // 👈 dette gjør alt right aligned
      textAlign: "right",       // 👈 sikrer tekstjustering
      gap: 2,
    }}
  >
    <span
      style={{
        fontSize: 13,
        color: "var(--text-muted)",
      }}
    >
      {titleRight}
    </span>

    <span
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "var(--text-secondary)",
      }}
    >
      {fmtKr(planned)} kr
    </span>
  </div>
)}
</div>



      {/* Hovedbeløp */}
      <div
        style={{
          fontSize: compact ? 26 : 40,
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

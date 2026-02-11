// src/app/components/onboarding/OnboardingProgress.tsx
"use client";

export function OnboardingProgress({
  step,
  total,
  durationText,
}: {
  step: number;
  total: number;
  durationText?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => {
            const active = i <= step;
            return (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: active ? "var(--hm-green, #22C55E)" : "rgba(0,0,0,0.12)",
                }}
              />
            );
          })}
        </div>

        {durationText ? (
          <div style={{ fontSize: 12, opacity: 0.55 }}>{durationText}</div>
        ) : null}
      </div>
    </div>
  );
}

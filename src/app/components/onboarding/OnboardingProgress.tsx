export function OnboardingProgress({
  step,
  total,
  durationText,
}: {
  step: number;
  total: number;
  durationText: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
        Steg {step + 1} av {total} · {durationText}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 4,
              background: i <= step ? "#0f172a" : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

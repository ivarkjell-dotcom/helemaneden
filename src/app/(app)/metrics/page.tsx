"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMetrics } from "../../lib/metrics";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState({ opens: 0, inputs: 0, days: 0 });

  const router = useRouter();

  useEffect(() => {
    setMetrics(getMetrics());
  }, []);

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
  <button
    onClick={() => router.back()}
    style={{
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <ArrowLeft size={22} />
  </button>
</div>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>
        Din bruk
      </h1>

      <section
        style={{
          marginTop: 16,
          background: "var(--bg-card)",
          borderRadius: 20,
          padding: 20,
          border: "1px solid var(--border-soft)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Antall åpninger av appen
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            {metrics.opens}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Antall oppdateringer av saldo
          </div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>
            {metrics.inputs}
          </div>
        </div>
      

        <div style={{ marginTop: 16 }}>
  <div style={{ fontSize: 13, opacity: 0.7 }}>
    Antall dager brukt
  </div>
  <div style={{ fontSize: 32, fontWeight: 800 }}>
    {metrics.days}
  </div>
</div>
      </section>

      <section style={{ marginTop: 20 }}>
        <p>Ta screenshot av denne siden og send til:</p>
        <p style={{ fontWeight: 700 }}>
          kontakt@helemaneden.no
        </p>
      </section>
    </main>
  );
}
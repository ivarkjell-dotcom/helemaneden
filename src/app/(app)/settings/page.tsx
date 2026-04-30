"use client";

import InfoTooltip from "../../components/ui/InfoTooltip";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const KEY = "hm_settings_v1";



type Settings = {
  monthStartBalance: number;
  monthStartDate: string;
  nextPayday: string;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function SettingsPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const [s, setS] = useState<Settings>({
    monthStartBalance: 0,
    monthStartDate: todayISO(),
    nextPayday: todayISO(),
  });

  const [original, setOriginal] = useState<Settings | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setS(parsed);
        setOriginal(parsed);
      } else {
        setOriginal(s);
      }
    } catch {}
  }, []);

  function save() {
    setError("");

    if (!s.monthStartDate || !s.nextPayday) {
      setError("Du må fylle inn begge datoene.");
      return;
    }

    if (s.nextPayday <= s.monthStartDate) {
      setError("Neste lønn må være etter lønnsdato.");
      return;
    }

    if (s.monthStartBalance < 0) {
      setError("Saldo kan ikke være negativ.");
      return;
    }

    localStorage.setItem(KEY, JSON.stringify(s));
    setOriginal(s); // 👈 oppdater original
    router.push("/");
  }

  // ✅ Sjekk om noe er endret
  const isChanged =
    !original ||
    s.monthStartBalance !== original.monthStartBalance ||
    s.monthStartDate !== original.monthStartDate ||
    s.nextPayday !== original.nextPayday;

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "0 auto",
        padding: 16,
        display: "grid",
        gap: 14,
      }}
    >
      <h1 style={{ fontSize: 20, margin: 0 }}>Oppsett</h1>

      <p style={{ marginTop: "4px", color: "#6b7280", fontSize: "14px" }}>
  Legg inn hva du har tilgjengelig etter faste utgifter.  
  Vi bruker det til å beregne hva du trygt kan bruke frem til neste lønn.
      </p>

      <InfoTooltip title="Hva skal jeg legge inn?">
  <p>
    Det du har igjen å bruke frem til neste lønn.
  </p>

  <p style={{ marginTop: "8px" }}>
    Betal faste utgifter og sett av til sparing først.  
    Legg deretter inn det som er igjen.
  </p>

  <p style={{ marginTop: "8px" }}>
    Ikke hele saldoen på konto, men det som faktisk er tilgjengelig.
  </p>

  <p style={{ marginTop: "10px", fontWeight: 600 }}>
    Starter du midt i perioden?
  </p>

  <p>
    Legg inn det du har igjen i dag.  
    Da får du et riktig svar fremover.
  </p>

  <p style={{ marginTop: "10px", fontWeight: 600 }}>
    Hva med datoene?
  </p>

  <p>
    Startdato er når perioden din begynner.
  </p>

  <p style={{ marginTop: "6px" }}>
    Har du fått lønn nylig, bruk lønnsdato.
  </p>

  <p style={{ marginTop: "6px" }}>
    Starter du nå, bruk dagens dato.
  </p>

  <p style={{ marginTop: "6px" }}>
    Neste lønn er når neste periode starter.
  </p>
</InfoTooltip>

      {error && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#991B1B",
            padding: 10,
            borderRadius: 20,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>
          Saldo tilgjengelig nå
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={s.monthStartBalance}
          onChange={(e) =>
            setS({
              ...s,
              monthStartBalance: Number(e.target.value || 0),
            })
          }
          style={{
  padding: 14,
  borderRadius: 20,
  border: "1px solid var(--border-soft)",
  fontSize: 16,
}}

        
        />

        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
  Etter faste utgifter og sparing
</p>

      </label>

      <label style={{ display: "grid", gap: 6 }}>
  <span style={{ fontWeight: 700 }}>
    Startdato
  </span>

  <input
    type="date"
    value={s.monthStartDate}
    onChange={(e) =>
      setS({
        ...s,
        monthStartDate: e.target.value,
      })
    }
    style={{
      padding: 14,
      borderRadius: 20,
      border: "1px solid var(--border-soft)",
      fontSize: 16,
    }}
  />

  <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
    Bruk lønnsdato, eller i dag hvis du starter nå
  </p>
</label>

      <label style={{ display: "grid", gap: 6 }}>
  <span style={{ fontWeight: 700 }}>
    Neste lønn
  </span>

  <input
    type="date"
    value={s.nextPayday}
    onChange={(e) =>
      setS({
        ...s,
        nextPayday: e.target.value,
      })
    }
    style={{
      padding: 14,
      borderRadius: 20,
      border: "1px solid var(--border-soft)",
      fontSize: 16,
    }}
  />

  <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
    Når neste periode starter
  </p>
</label>

      <button
        onClick={save}
        disabled={!isChanged}
        style={{
          background: isChanged ? "#62AAC0" : "#9CA3AF",
          color: "#fff",
          border: "none",
          padding: "12px 16px",
          borderRadius: 20,
          fontWeight: 600,
          cursor: isChanged ? "pointer" : "not-allowed",
          opacity: isChanged ? 1 : 0.7,
          transition: "all 0.2s ease",
        }}
      >
        Start måneden
      </button>
    </main>
  );
}

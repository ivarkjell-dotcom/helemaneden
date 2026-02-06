"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const KEY = "hm_settings_v1";

type Settings = {
  monthStartBalance: number;
  monthStartDate: string; // YYYY-MM-DD
  nextPayday: string;     // YYYY-MM-DD
};

export default function SettingsPage() {
  const router = useRouter();

  const [s, setS] = useState<Settings>({
    monthStartBalance: 15000,
    monthStartDate: new Date().toISOString().slice(0, 10),
    nextPayday: "2026-02-01",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setS(JSON.parse(raw));
    } catch {}
  }, []);

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));

    // ✅ Gå rett tilbake til Home
    router.push("/");
  }

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
      <h1 style={{ fontSize: 20, margin: 0 }}>Innstillinger</h1>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>Saldo ved lønn (start)</span>
        <input
          inputMode="numeric"
          value={s.monthStartBalance}
          onChange={(e) =>
            setS({ ...s, monthStartBalance: Number(e.target.value || 0) })
          }
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>Startdato (for lønnsperioden)</span>
        <input
          type="date"
          value={s.monthStartDate}
          onChange={(e) =>
            setS({ ...s, monthStartDate: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>Neste lønn</span>
        <input
          type="date"
          value={s.nextPayday}
          onChange={(e) =>
            setS({ ...s, nextPayday: e.target.value })
          }
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        />
      </label>

      <button
        onClick={save}
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "var(--accent-safe)",
          color: "white",
          fontWeight: 800,
        }}
      >
        Lagre og start måneden
      </button>
    </main>
  );
}

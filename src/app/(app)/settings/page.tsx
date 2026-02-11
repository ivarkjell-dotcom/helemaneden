"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanProgressBar } from "@/app/components/PlanProgressBar";

const KEY = "hm_settings_v1";

type Settings = {
  monthStartBalance: number;
  monthStartDate: string;
  nextPayday: string;
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
      <h1 style={{ fontSize: 20, margin: 0 }}>Oppsett</h1>
      <span style={{ 
    fontSize: 12, 
    color: "#6b7280" 
  }}>
     Denne siden skal endres kun ved starten av ny måned.
  </span>

      {/* Inputs */}
      <label style={{ display: "grid", gap: 4 }}>
  <span style={{ fontWeight: 700 }}>
    Saldo på brukskonto ved starten av måneden
  </span>

  <input
    inputMode="numeric"
    value={s.monthStartBalance}
    onChange={(e) =>
      setS({ ...s, monthStartBalance: Number(e.target.value || 0) })
    }
  />

  <span style={{ 
    fontSize: 12, 
    color: "#6b7280" 
  }}>
    Denne metoden fungerer best hvis faste regninger er betalt før du starter perioden.
  </span>
</label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>Dato for lønn</span>
        <input
          type="date"
          value={s.monthStartDate}
          onChange={(e) =>
            setS({ ...s, monthStartDate: e.target.value })
          }
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 700 }}>Siste dag før neste lønn</span>
        <input
          type="date"
          value={s.nextPayday}
          onChange={(e) =>
            setS({ ...s, nextPayday: e.target.value })
          }
        />
      </label>

      <button className="btn-primary" onClick={save}>
        Lagre og start måneden
      </button>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      {/* App section */}
      
    </main>
  );
}

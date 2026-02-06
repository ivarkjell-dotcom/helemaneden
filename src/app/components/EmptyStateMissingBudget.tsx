"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

export function EmptyStateMissingBudget() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/settings");
    }, 1200); // rolig, ikke brå

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      style={{
        marginTop: 32,
        padding: 24,
        borderRadius: 20,
        background: "var(--green-50)",
        border: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <Wallet size={22} color="var(--green-700)" />

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        Klar til ny lønnsperiode
      </div>

      <div
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.4,
        }}
      >
        For å kunne vise deg trygge dag- og ukebeløp,
        trenger vi lønn og datoer for denne perioden.
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        Tar deg dit nå…
      </div>
    </div>
  );
}

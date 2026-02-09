"use client";

import Link from "next/link";
import { Menu, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const SETTINGS_KEY = "hm_settings_v1";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isValidBudget(settings: any) {
  if (!settings) return false;

  const { monthStartBalance, monthStartDate, nextPayday } = settings;

  if (!monthStartBalance || monthStartBalance <= 0) return false;
  if (!monthStartDate || !nextPayday) return false;

  const today = todayISO();
  return today >= monthStartDate && today < nextPayday;
}

type TopBarProps = {
  onMenuClick: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const settings = raw ? JSON.parse(raw) : null;
      setShowBanner(!isValidBudget(settings));
    } catch {
      setShowBanner(true);
    }
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        color: "var(--text-primary)",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo → alltid hjem */}
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: 16,
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          HeleMåneden
        </Link>

        {/* Meny-knapp */}
        <button
          aria-label="Åpne meny"
          onClick={onMenuClick}
          style={{
            background: "transparent",
            border: "none",
            padding: 4,
            cursor: "pointer",
            color: "var(--icon)",
          }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Banner ved manglende/utløpt lønnsperiode */}
      {showBanner && (
        <Link
          href="/settings"
          style={{
            display: "block",
            textDecoration: "none",
            background: "var(--accent-soft)",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div
            style={{
              maxWidth: 520,
              margin: "0 auto",
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={18} color="currentColor" />
            <span>
              Ny lønnsperiode ikke satt – legg inn lønn og datoer
            </span>
          </div>
        </Link>
      )}
    </header>
  );
}

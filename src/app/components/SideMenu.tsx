"use client";

import Link from "next/link";
import { X, User, Settings, Bell, Calendar, Shield, Info } from "lucide-react";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function SideMenu({ open, onClose }: SideMenuProps) {
  if (!open) return null;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 8px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#111",
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.9,
  };

  const iconProps = { size: 20, strokeWidth: 1.8 };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.25)",
      }}
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "80%",
          maxWidth: 320,
          background: "white",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Lukk meny"
          style={{
            alignSelf: "flex-end",
            border: "none",
            background: "none",
            padding: 4,
          }}
        >
          <X size={22} />
        </button>

        {/* Menu */}
        <nav style={{ display: "grid", gap: 6 }}>
          <Link href="/" onClick={onClose} style={itemStyle}>
            <User {...iconProps} />
            <span>Hjem</span>
          </Link>

          <Link href="/settings" onClick={onClose} style={itemStyle}>
            <Calendar {...iconProps} />
            <span>Lønn og datoer</span>
          </Link>

          <Link href="/overview" onClick={onClose} style={itemStyle}>
            <Info {...iconProps} />
            <span>Oversikt</span>
          </Link>

          <Link href="/settings" onClick={onClose} style={itemStyle}>
            <Bell {...iconProps} />
            <span>Påminnelser</span>
          </Link>

          <Link href="/settings" onClick={onClose} style={itemStyle}>
            <Settings {...iconProps} />
            <span>Innstillinger</span>
          </Link>

          <Link href="/settings" onClick={onClose} style={itemStyle}>
            <Shield {...iconProps} />
            <span>Personvern</span>
          </Link>
        </nav>
      </aside>
    </div>
  );
}

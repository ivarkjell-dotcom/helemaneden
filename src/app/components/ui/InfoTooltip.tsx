"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hm_seen_settings_info";

export default function InfoTooltip({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  return (
    <div style={{ marginTop: 8 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: "#6b7280",
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1px solid #D1D5DB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          i
        </span>
        {title}
      </button>

      {/* Content */}
      {open && (
        <div
          style={{
            marginTop: 10,
            padding: 14,
            borderRadius: 16,
            background: "var(--bg-card, #F9FAFB)",
            border: "1px solid var(--border-soft, #E5E7EB)",
            fontSize: 14,
            lineHeight: 1.5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
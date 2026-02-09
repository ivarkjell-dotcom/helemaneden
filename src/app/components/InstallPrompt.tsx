"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "hm_dismiss_install_prompt_v1";

let deferredPrompt: any = null;

export default function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === "true") return;

    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        background: "white",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 14 }}>
        📱 Legg <strong>HeleMåneden</strong> til som app på hjemskjermen
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleInstall}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: "#0f172a",
            color: "white",
            fontWeight: 600,
          }}
        >
          Installer
        </button>

        <button
          onClick={handleDismiss}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#555",
          }}
        >
          Lukk
        </button>
      </div>
    </div>
  );
}

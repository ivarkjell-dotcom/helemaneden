"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any = null;

export default function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
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
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    deferredPrompt = null;
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
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 14 }}>
        📱 Legg HeleMåneden til som app på hjemskjermen
      </div>
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
    </div>
  );
}

"use client";

import React from "react";

export function IosInstallGuide() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isIos && !isStandalone) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        background: "var(--bg-elev-2)",
        border: "1px solid var(--border-soft)",
        borderRadius: 14,
        padding: 16,
        zIndex: 999,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>
        <strong>Installer HeleMåneden</strong>
        <p style={{ marginTop: 8 }}>
          Trykk på del-ikonet i Safari og velg
          <strong> “Legg til på Hjem-skjerm”</strong>.
        </p>
      </div>

      <button
        onClick={() => setShow(false)}
        style={{
          marginTop: 12,
          background: "transparent",
          border: "none",
          fontSize: 13,
          opacity: 0.6,
          cursor: "pointer",
        }}
      >
        Lukk
      </button>
    </div>
  );
}

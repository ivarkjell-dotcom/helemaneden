"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Wallet,
  Settings,
  Bell,
  Moon,
  Download,
  Check,
} from "lucide-react";

type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function SideMenu({ open, onClose }: SideMenuProps) {
  const [notificationsOn, setNotificationsOn] = React.useState(false);
  const [weekdayTime, setWeekdayTime] = React.useState("09:00");
  const [weekendTime, setWeekendTime] = React.useState("10:00");
  const [darkModeOn, setDarkModeOn] = React.useState(false);

  const [isInstalled, setIsInstalled] = React.useState(false);
  const [installPrompt, setInstallPrompt] = React.useState<any>(null);

  /* ===== INIT ===== */
  React.useEffect(() => {
    setNotificationsOn(
      localStorage.getItem("hm_notifications_enabled") === "true"
    );

    setDarkModeOn(localStorage.getItem("hm_dark_mode") === "true");

    setWeekdayTime(
      localStorage.getItem("hm_notification_time_weekday") || "09:00"
    );
    setWeekendTime(
      localStorage.getItem("hm_notification_time_weekend") || "10:00"
    );

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!open) return null;

  const iconProps = { size: 20, strokeWidth: 1.8 };

  function Toggle({
    on,
    onToggle,
  }: {
    on: boolean;
    onToggle: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: on
            ? "var(--btn-primary-bg)"
            : "var(--progress-track)",
          position: "relative",
          border: "1px solid var(--border-soft)",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: on ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--bg-elev-1)",
            transition: "left 0.2s ease",
          }}
        />
      </button>
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.4)",
      }}
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
          background: "var(--bg-elev-2)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          borderLeft: "1px solid var(--border-soft)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Lukk meny"
          style={{
            alignSelf: "flex-end",
            border: "none",
            background: "transparent",
            padding: 4,
          }}
        >
          <X size={22} />
        </button>

        <nav style={{ display: "grid", gap: 12 }}>
          {/* Primary */}
          

          {/* Settings */}
          <div>
  <div
    style={{
      padding: "10px 8px",
      fontSize: 13,
      fontWeight: 700,
      opacity: 0.7,
    }}
  >
    <span>Personlige valg</span>
  </div>


            <div style={{ paddingLeft: 32, display: "grid", gap: 14 }}>
              {/* Varsler */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Bell {...iconProps} />
                <span style={{ flex: 1 }}>Varsler</span>
                <Toggle
                  on={notificationsOn}
                  onToggle={async () => {
                    const next = !notificationsOn;

                    if (next && "Notification" in window) {
                      const p = await Notification.requestPermission();
                      if (p !== "granted") return;
                    }

                    setNotificationsOn(next);
                    localStorage.setItem(
                      "hm_notifications_enabled",
                      String(next)
                    );
                  }}
                />
              </div>

              {notificationsOn && (
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    marginLeft: 32,
                    fontSize: 13,
                  }}
                >
                  <label style={{ display: "flex", gap: 8 }}>
                    <span style={{ width: 80 }}>Ukedager</span>
                    <input
                      type="time"
                      value={weekdayTime}
                      onChange={(e) => {
                        setWeekdayTime(e.target.value);
                        localStorage.setItem(
                          "hm_notification_time_weekday",
                          e.target.value
                        );
                      }}
                    />
                  </label>

                  <label style={{ display: "flex", gap: 8 }}>
                    <span style={{ width: 80 }}>Helg</span>
                    <input
                      type="time"
                      value={weekendTime}
                      onChange={(e) => {
                        setWeekendTime(e.target.value);
                        localStorage.setItem(
                          "hm_notification_time_weekend",
                          e.target.value
                        );
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Dark mode */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Moon {...iconProps} />
                <span style={{ flex: 1 }}>Mørk modus</span>
                <Toggle
                  on={darkModeOn}
                  onToggle={() => {
                    const next = !darkModeOn;
                    setDarkModeOn(next);
                    localStorage.setItem("hm_dark_mode", String(next));
                    document.documentElement.setAttribute(
                      "data-theme",
                      next ? "dark" : "light"
                    );
                  }}
                />
              </div>

              {/* Install */}
              {isInstalled ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    opacity: 0.6,
                  }}
                >
                  <Check {...iconProps} />
                  <span>Appen er installert på denne enheten</span>
                </div>
              ) : installPrompt ? (
                <button
                  type="button"
                  onClick={async () => {
                    installPrompt.prompt();
                    const res = await installPrompt.userChoice;
                    if (res.outcome === "accepted") {
                      setIsInstalled(true);
                      setInstallPrompt(null);
                    }
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: 13,
                    textAlign: "left",
                  }}
                >
                  <Download {...iconProps} />
                  <span>Installer HeleMåneden</span>
                </button>
              ) : (
                <div style={{ fontSize: 13, opacity: 0.6 }}>
                  Installering støttes ikke i denne nettleseren
                </div>
              )}

              <Link
  href="/data-sikkerhet"
  onClick={onClose}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    fontSize: 13,
    textDecoration: "none",
    color: "var(--text-primary)",
    opacity: 0.8,
  }}
>
  <span>Data og sikkerhet</span>
</Link>

            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}

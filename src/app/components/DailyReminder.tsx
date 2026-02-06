"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

const REMINDER_ENABLED_KEY = "hm_reminder_enabled";
const REMINDER_TIME_WEEKDAY_KEY = "hm_reminder_time_weekday";
const REMINDER_TIME_WEEKEND_KEY = "hm_reminder_time_weekend";

function isWeekend(date: Date) {
  const day = date.getDay(); // 0 = søndag, 6 = lørdag
  return day === 0 || day === 6;
}

export default function DailyReminder() {
  const [enabled, setEnabled] = useState(false);
  const [weekdayTime, setWeekdayTime] = useState("09:00");
  const [weekendTime, setWeekendTime] = useState("10:00");

  useEffect(() => {
    const isEnabled = localStorage.getItem(REMINDER_ENABLED_KEY) === "true";

    const weekday =
      localStorage.getItem(REMINDER_TIME_WEEKDAY_KEY) ?? "09:00";
    const weekend =
      localStorage.getItem(REMINDER_TIME_WEEKEND_KEY) ?? "10:00";

    setWeekdayTime(weekday);
    setWeekendTime(weekend);

    if (isEnabled) {
      setEnabled(true);
      scheduleNotification(weekday, weekend);
    }
  }, []);

  const enableReminder = async () => {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    localStorage.setItem(REMINDER_ENABLED_KEY, "true");
    localStorage.setItem(REMINDER_TIME_WEEKDAY_KEY, weekdayTime);
    localStorage.setItem(REMINDER_TIME_WEEKEND_KEY, weekendTime);

    setEnabled(true);
    scheduleNotification(weekdayTime, weekendTime);
  };

  const scheduleNotification = (
    weekdayTime: string,
    weekendTime: string
  ) => {
    const now = new Date();
    const target = new Date();

    const time = isWeekend(now) ? weekendTime : weekdayTime;
    const [hour, minute] = time.split(":").map(Number);

    target.setHours(hour, minute, 0, 0);

    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const delay = target.getTime() - now.getTime();

    setTimeout(() => {
      new Notification("HeleMåneden", {
        body: "God morgen – husk å legge inn saldo for i dag 💙",
        icon: "/images/icon-color-192.png",
      });

      // Planlegg neste dag på nytt
      scheduleNotification(weekdayTime, weekendTime);
    }, delay);
  };

  if (enabled) return null;

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.1)",
        background: "rgba(0,0,0,0.03)",
        fontSize: 14,
      }}
    >
      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    fontWeight: 600,
  }}
>
  <Bell size={18} strokeWidth={1.8} />
  <span>Vil du ha en daglig påminnelse?</span>
</div>


      <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 10 }}>
        Velg tidspunkt for hverdag og helg.
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Påminnelse på hverdager
          </span>
          <input
            type="time"
            value={weekdayTime}
            onChange={(e) => {
              setWeekdayTime(e.target.value);
              localStorage.setItem(
                REMINDER_TIME_WEEKDAY_KEY,
                e.target.value
              );
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Påminnelse i helg
          </span>
          <input
            type="time"
            value={weekendTime}
            onChange={(e) => {
              setWeekendTime(e.target.value);
              localStorage.setItem(
                REMINDER_TIME_WEEKEND_KEY,
                e.target.value
              );
            }}
          />
        </label>
      </div>

      <button
        onClick={enableReminder}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "none",
          background: "#0f172a",
          color: "white",
          fontWeight: 600,
        }}
      >
        Slå på påminnelse
      </button>
    </div>
  );
}

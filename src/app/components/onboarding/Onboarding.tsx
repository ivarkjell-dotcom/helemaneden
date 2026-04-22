// src/app/components/onboarding/Onboarding.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { standardOnboarding, pwaOnboarding } from "./onboardingContent";
import { OnboardingProgress } from "./OnboardingProgress";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Coins,
  BarChart3,
  Wallet,
} from "lucide-react";

const ONBOARDING_SEEN_KEY = "hm_onboarding_seen";
const ONBOARDING_ACTIVE_KEY = "hm_onboarding_active";
const FORCE_ONBOARDING = false; // 🔧 kun for testing

function emitOnboardingToggle() {
  // localStorage-endring trigger ikke "storage" i samme tab, så vi sender et event.
  document.dispatchEvent(new Event("hm_onboarding_toggle"));
}

export default function Onboarding() {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [content, setContent] = useState(standardOnboarding);
  const [expanded, setExpanded] = useState(false);

  const hasInitialized = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // velg PWA vs web + show/hide
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const isPwa =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;

    setContent(isPwa ? pwaOnboarding : standardOnboarding);

    if (FORCE_ONBOARDING) {
      localStorage.setItem(ONBOARDING_ACTIVE_KEY, "true");
      emitOnboardingToggle();
      setVisible(true);
      return;
    }

    const seen = localStorage.getItem(ONBOARDING_SEEN_KEY);
    if (!seen) {
      localStorage.setItem(ONBOARDING_ACTIVE_KEY, "true");
      emitOnboardingToggle();
      setVisible(true);
    }
  }, []);

  const total = content.steps.length;
  const current = content.steps[step];
  const isLast = step === total - 1;

  // reset “les mer” når vi bytter steg
  useEffect(() => {
    setExpanded(false);
  }, [step]);

  const fadeKey = useMemo(() => `${current.key}-${step}`, [current.key, step]);

  function next() {
    if (step + 1 < total) setStep(step + 1);
    else finish();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function finish() {
    localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    localStorage.setItem(ONBOARDING_ACTIVE_KEY, "false");
    emitOnboardingToggle();
    setVisible(false);
    router.replace("/settings");
  }

  function skip() {
    // hvis du ønsker “siste steg obligatorisk”, kan du nekte skip før siste:
    if (!isLast) {
      // ikke gjør noe (obligatorisk forløp)
      return;
    }
    finish();
  }

  // swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const startX = touchStartX.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;
    if (startX == null || endX == null) return;

    const dx = endX - startX;
    if (Math.abs(dx) < 50) return;

    if (dx < 0) next(); // swipe venstre -> neste
    if (dx > 0) back(); // swipe høyre -> tilbake
  }

  if (!visible) return null;

  const textMuted = "rgba(0,0,0,0.62)";

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        zIndex: 10000,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <OnboardingProgress
          step={step}
          total={total}
          durationText={content.durationText}
        />

        {/* Fade container */}
        <div
          key={fadeKey}
          style={{
            animation: "hmFade 220ms ease-out",
          }}
        >
          <h2 style={{ marginBottom: 14, fontSize: 24, lineHeight: 1.2 }}>
            {current.title}
          </h2>

          {current.body.map((line, i) => (
            <p key={i} style={{ opacity: 0.9, color: textMuted, marginTop: 8, lineHeight: 1.5 }}>
              {line}
            </p>
          ))}

          

          {/* Siste steg: “Kom i gang” */}
          {isLast ? (
            <div style={{ marginTop: 18 }}>
              <div
                style={{
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 14,
                  padding: 14,
                  background: "rgba(0,0,0,0.02)",
                }}
              >
                <StepRow
                  n={1}
                  icon={<Settings size={18} />}
                  title="Gå til Oppsett"
                  desc="Sett startbeløp og datoer."
                />
                <StepRow
                  n={2}
                  icon={<Coins size={18} />}
                  title="Legg inn beløp og dato"
                  desc="Lønn og neste lønningsdag."
                />
                <StepRow
                  n={3}
                  icon={<BarChart3 size={18} />}
                  title="Se utregningene i Oversikt"
                  desc="Følg logikken bak “trygt å bruke”."
                />
                <StepRow
                  n={4}
                  icon={<Wallet size={18} />}
                  title="Oppdater saldo når du vil"
                  desc="Jo oftere, jo mer presist."
                  last
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <button
          onClick={next}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#0f172a",
            color: "white",
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          {isLast ? "Gå til Oppsett" : "Neste"}
        </button>

        {/* “Hopp over” – men obligatorisk før siste steg */}
        <button
          onClick={skip}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            opacity: isLast ? 0.7 : 0.25,
            fontSize: 13,
            cursor: isLast ? "pointer" : "not-allowed",
          }}
          aria-disabled={!isLast}
        >
          Hopp over
        </button>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.5, textAlign: "center" }}>
          Tips: Sveip ← → for å bytte steg
        </div>
      </div>

      {/* liten inline keyframes uten CSS-fil */}
      <style>{`
        @keyframes hmFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StepRow({
  n,
  icon,
  title,
  desc,
  last,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "24px 28px 1fr",
        gap: 10,
        padding: "10px 0",
        borderBottom: last ? "none" : "1px solid rgba(0,0,0,0.06)",
        alignItems: "start",
      }}
    >
      <div style={{ fontWeight: 900, opacity: 0.8 }}>{n}.</div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: "white",
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

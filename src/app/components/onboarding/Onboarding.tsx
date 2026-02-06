"use client";

import { useEffect, useState, useRef } from "react";
import { standardOnboarding, pwaOnboarding } from "./onboardingContent";
import { OnboardingProgress } from "./OnboardingProgress";

const ONBOARDING_SEEN_KEY = "hm_onboarding_seen";
const FORCE_ONBOARDING = false; // 🔧 kun for testing – settes til false senere

export default function Onboarding() {
  // ✅ DISSE SKAL LIGGE ØVERST I FUNKSJONEN
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [content, setContent] = useState(standardOnboarding);
  const hasInitialized = useRef(false);


  // ✅ ALT SOM BRUKER window SKAL INN HER
  useEffect(() => {
  // 🔒 Hindrer dobbeltkjøring i React Strict Mode (dev)
  if (hasInitialized.current) return;
  hasInitialized.current = true;

  // 1️⃣ Velg riktig onboarding (PWA vs web)
  const isPwa =
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches;

  setContent(isPwa ? pwaOnboarding : standardOnboarding);

  // 2️⃣ Vis onboarding
  if (FORCE_ONBOARDING) {
    setVisible(true);
    return;
  }

  const seen = localStorage.getItem(ONBOARDING_SEEN_KEY);
  if (!seen) {
    setVisible(true);
  }
}, []);


  // 🚪 Hvis ikke synlig → vis ingenting
  if (!visible) return null;

  const current = content.steps[step];

  function next() {
    if (step + 1 < content.steps.length) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function finish() {
  localStorage.setItem("hm_onboarding_seen", "true");
  localStorage.setItem("hm_onboarding_active", "false");
  setVisible(false);
}


  return (
    <div
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
          total={content.steps.length}
          durationText={content.durationText}
        />

        <h2 style={{ marginBottom: 12 }}>{current.title}</h2>

        {current.body.map((line, i) => (
          <p key={i} style={{ opacity: 0.8 }}>
            {line}
          </p>
        ))}
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
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {step + 1 === content.steps.length ? "Start appen" : "Neste"}
        </button>

        <button
          onClick={finish}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            opacity: 0.6,
            fontSize: 13,
          }}
        >
          Hopp over
        </button>
      </div>
    </div>
  );
}

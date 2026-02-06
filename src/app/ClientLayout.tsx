"use client";

import { useEffect, useState } from "react";
import Onboarding from "./components/onboarding/Onboarding";
import { BottomNav } from "./components/BottomNav";
import { TopBar } from "./components/TopBar";
import { SideMenu } from "./components/SideMenu";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  useEffect(() => {
    const check = () => {
      setHideUI(localStorage.getItem("hm_onboarding_active") === "true");
    };

    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <>
      <Onboarding />

      {!hideUI && (
        <>
          <TopBar onMenuClick={() => setMenuOpen(true)} />
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      )}

      <div
        style={{
          paddingTop: hideUI ? 0 : 56,
          paddingBottom: hideUI ? 0 : 64,
        }}
      >
        {children}
      </div>

      {!hideUI && <BottomNav />}
    </>
  );
}

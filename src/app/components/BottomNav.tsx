"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, BarChart3 } from "lucide-react";


export function BottomNav() {
  const pathname = usePathname();

  function isActive(path: string) {
    return pathname === path;
  }

  const linkStyle = (active: boolean) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontWeight: active ? 700 : 500,
    opacity: active ? 1 : 0.6,
    textDecoration: "none",
    color: "var(--text-primary)",
    fontSize: "12px",
  });

  return (
    <nav
      className="bottom-nav"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <Link href="/" style={linkStyle(isActive("/"))}>
        <Home size={22} strokeWidth={1.8} />
        <span>Home</span>
      </Link>

      <Link href="/settings" style={linkStyle(isActive("/settings"))}>
  <Settings size={22} strokeWidth={1.8} />
  <span>Oppsett</span>
</Link>


      <Link href="/overview" style={linkStyle(isActive("/overview"))}>
        <BarChart3 size={22} strokeWidth={1.8} />
        <span>Oversikt</span>
      </Link>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/", label: "Dashboard", accent: "A" }]
  },
  {
    title: "Operations",
    items: [
      { href: "/clients", label: "Clients", accent: "C" },
      { href: "/cases", label: "Matters", accent: "M" },
      { href: "/hearings", label: "Hearings", accent: "H" },
      { href: "/documents", label: "Documents", accent: "D" }
    ]
  }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isAuthRoute) {
    return <div className="auth-layout">{children}</div>;
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div>
          <div className="brand-mark">LF</div>
          <div className="brand-copy">
            <p className="eyebrow">B2B legal operations</p>
            <h1>LexOra</h1>
          </div>
        </div>
        <div className="sidebar-panel">
          <p className="eyebrow">Private workspace</p>
          <p className="muted small">Your clients, matters, documents, and hearings stay isolated to your account.</p>
        </div>
        <nav className="side-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="side-nav__group">
              <p className="side-nav__heading">{group.title}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("side-nav__item", pathname === item.href && "side-nav__item--active")}
                >
                  <span className="side-nav__icon">{item.accent}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-panel sidebar-panel--footer">
            <p className="eyebrow">Operational mode</p>
            <p className="muted small">Designed for advocates, partners, and legal ops teams.</p>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="app-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Law firm workspace</p>
            <h2 className="topbar__title">Case and client operations</h2>
          </div>
          <div className="topbar__meta">
            <span className="dot" />
            Secure workspace
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

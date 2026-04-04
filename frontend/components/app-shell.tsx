"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/cases", label: "Matters" },
  { href: "/hearings", label: "Hearings" },
  { href: "/documents", label: "Documents" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
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
        <nav className="side-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("side-nav__item", pathname === item.href && "side-nav__item--active")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="muted small">Designed for advocates, partners, and legal ops teams.</p>
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

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: "⌂", accent: "A" }]
  },
  {
    title: "Operations",
    items: [
      { href: "/clients", label: "Clients", icon: "👤", accent: "C" },
      { href: "/cases", label: "Matters", icon: "⚖", accent: "M" },
      { href: "/hearings", label: "Hearings", icon: "🗓", accent: "H" },
      { href: "/documents", label: "Documents", icon: "📄", accent: "D" }
    ]
  }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Routes that shouldn't show the sidebar workspace UI
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isLandingRoute = pathname === "/";

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // Page title from route
  const pageTitle =
    pathname === "/dashboard" ? "Dashboard" :
    pathname.startsWith("/clients") ? "Clients" :
    pathname.startsWith("/cases") ? "Matters" :
    pathname.startsWith("/hearings") ? "Hearings" :
    pathname.startsWith("/documents") ? "Documents" : "Workspace";

  // Completely bypass workspace shell for unauthenticated/marketing pages
  if (isAuthRoute || isLandingRoute) {
    return <div className="full-bleed-layout">{children}</div>;
  }

  return (
    <div className="app-shell">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="app-sidebar">
        {/* Brand */}
        <div className="sidebar-top">
          <div className="brand-mark">L</div>
          <div className="brand-copy">
            <h1>LexOra</h1>
            <p>Legal Operations Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="side-nav">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="side-nav__heading">{group.title}</p>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "side-nav__item",
                    (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) &&
                      "side-nav__item--active"
                  )}
                >
                  <span className="side-nav__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user__avatar">A</div>
            <div>
              <p className="sidebar-user__name">Administrator</p>
              <p className="sidebar-user__role">Admin — Full access</p>
            </div>
          </div>
          <button className="sidebar-signout" onClick={handleSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="app-main">
        <header className="topbar">
          <div className="topbar__left">
            <div className="topbar__breadcrumbs">
              <span>Workspace</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{pageTitle}</span>
            </div>
            <h2 className="topbar__title">{pageTitle}</h2>
          </div>
          <div className="topbar__right">
            <button className="topbar__btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <div className="topbar__meta">
              <span className="dot" />
              <span>Workspace active</span>
            </div>
          </div>
        </header>
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}

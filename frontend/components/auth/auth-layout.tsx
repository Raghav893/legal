"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShinyButton } from "@/components/magicui/shiny-button";

export function AuthLayout({
  children,
  eyebrow,
  title,
  subtitle
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03060f] text-white">
      <DotPattern className="text-white/[0.06]" width={22} height={22} />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(184,146,74,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <aside className="relative hidden flex-col justify-between border-r border-white/[0.06] p-12 xl:p-16 lg:flex">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-90">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-[#80622a] text-sm font-bold text-white shadow-lg shadow-gold/20">
                L
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">LexOra</span>
            </Link>
            <p className="mt-14 text-xs font-semibold uppercase tracking-[0.25em] text-gold/90">{eyebrow}</p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-[1.1] tracking-tight text-white xl:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/45">{subtitle}</p>
            <div className="mt-12">
              <Link href="/">
                <ShinyButton className="border-gold/30 bg-white/[0.06] text-white hover:shadow-gold/20">
                  Back to home
                </ShinyButton>
              </Link>
            </div>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/25">Enterprise-grade legal operations</p>
        </aside>

        <div className="flex flex-col items-center justify-center px-4 py-14 sm:px-8">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2.5 self-start transition-opacity hover:opacity-90 lg:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-[#80622a] text-xs font-bold text-white">
              L
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">LexOra</span>
          </Link>

          <div className="relative w-full max-w-[440px] overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <MagicCard
              className="rounded-2xl"
              gradientSize={240}
              gradientColor="rgba(255,255,255,0.985)"
              gradientFrom="rgba(184,146,74,0.42)"
              gradientTo="rgba(212,170,106,0.28)"
            >
              <div className="rounded-[inherit] bg-white/[0.97] text-card-foreground">{children}</div>
            </MagicCard>
            <BorderBeam size={140} duration={9} borderWidth={2} colorFrom="#b8924a" colorTo="#fff8e8" />
          </div>
        </div>
      </div>
    </div>
  );
}

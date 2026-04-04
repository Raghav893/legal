"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ShinyButton } from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("landing-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 ease-out",
        pastHero
          ? "border-b border-black/[0.06] bg-[#fbfbfd]/85 text-[#1d1d1f] shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent text-white"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-screen-2xl items-center justify-between px-6 md:h-20 md:px-12 lg:px-16">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-[10px] text-sm font-semibold transition-colors md:h-10 md:w-10",
              pastHero
                ? "bg-[#1d1d1f] text-white"
                : "bg-gradient-to-br from-gold to-[#80622a] text-white shadow-lg shadow-gold/20"
            )}
          >
            L
          </div>
          <span
            className={cn(
              "text-[13px] font-semibold tracking-[-0.02em] md:text-[15px]",
              pastHero ? "text-[#1d1d1f]" : "text-white/95"
            )}
          >
            LexOra
          </span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full px-4 text-[13px] font-medium",
              pastHero
                ? "text-[#424245] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Link href="/signup" className="hidden sm:block">
            <ShinyButton
              className={cn(
                "rounded-full px-6 py-2.5 text-[12px] font-semibold tracking-wide",
                pastHero
                  ? "border border-black/[0.08] bg-[#1d1d1f] text-white hover:shadow-lg hover:shadow-black/10"
                  : "border-gold/35 bg-gold text-[#03060f] hover:shadow-[0_0_28px_rgba(184,146,74,0.35)]"
              )}
            >
              Start trial
            </ShinyButton>
          </Link>
          <Button
            size="sm"
            className={cn(
              "sm:hidden rounded-full px-4 text-[12px] font-semibold",
              pastHero ? "bg-[#1d1d1f] text-white hover:bg-[#2d2d2f]" : "bg-gold text-[#03060f] hover:bg-gold-light"
            )}
            asChild
          >
            <Link href="/signup">Start</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

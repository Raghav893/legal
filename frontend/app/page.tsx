import Link from "next/link";

import { FeatureCard } from "@/components/marketing/feature-card";
import { LandingDecor } from "@/components/marketing/landing-decor";
import { LandingHeader } from "@/components/marketing/landing-header";
import { StatementSection } from "@/components/marketing/statement-section";
import { Globe } from "@/components/magicui/globe";
import { LightRays } from "@/components/magicui/light-rays";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { TextReveal } from "@/components/magicui/text-reveal";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-black/10 selection:text-[#1d1d1f]">
      <LandingHeader />

      <section
        id="landing-hero"
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#03060f] px-4 pt-24 pb-16 text-white md:pt-0 md:pb-0"
      >
        <LightRays
          className="z-0 opacity-90"
          color="rgba(184, 146, 74, 0.14)"
          blur={48}
          speed={16}
          count={9}
          length="85vh"
        />
        <div className="relative z-[1]">
          <LandingDecor />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_100%_80%_at_50%_100%,rgba(3,6,15,0.92),transparent)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_minmax(260px,400px)] lg:gap-10 xl:max-w-7xl">
          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left md:gap-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold/90">
              Legal operations platform
            </p>
            <h1 className="text-balance text-4xl font-bold leading-[0.98] tracking-[-0.04em] drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,5vw,4.25rem)] xl:text-[clamp(3rem,5.5vw,4.75rem)]">
              Silence the noise.
              <br />
              <span className="text-white/35">Amplify the practice.</span>
            </h1>
            <p className="max-w-xl text-pretty text-base font-light leading-relaxed tracking-wide text-white/50 md:text-lg lg:text-xl">
              The operational hub for intake, calendars, hearings, and documents—built for clarity under pressure.
            </p>
            <div className="mt-1 flex flex-col items-center gap-4 sm:flex-row sm:gap-5 lg:items-start">
              <Link href="/signup">
                <ShinyButton className="border-gold/40 bg-gold px-10 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#03060f] hover:shadow-[0_0_32px_rgba(184,146,74,0.4)]">
                  Launch workspace
                </ShinyButton>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
                asChild
              >
                <Link href="/login" className="text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Sign in
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-[400px] lg:mx-0 lg:block xl:max-w-[440px]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_55%,rgba(184,146,74,0.08),transparent_62%)]" />
            <Globe className="relative z-[1]" />
          </div>
        </div>
      </section>

      <StatementSection />

      <section className="border-t border-black/[0.06] bg-[#f5f5f7]">
        <TextReveal className="mx-auto max-w-5xl px-4 md:px-8">
          Practice everywhere your clients need you—one workspace that stays aligned from intake to hearing.
        </TextReveal>
      </section>

      <section className="border-t border-black/[0.06] bg-[#fbfbfd] py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-[1068px] px-6 md:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20 lg:mb-24">
            <h2 className="text-balance text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-[#1d1d1f]">
              Everything in one calm surface.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed tracking-[-0.01em] text-[#6e6e73] md:text-[19px]">
              Less context switching. Fewer threads. A single place for how your firm actually works.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <FeatureCard
              title="Clients"
              description="Onboarding and records in one secure, searchable place—ready when you open a matter."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <FeatureCard
              title="Matters"
              description="Proceedings, hearings, and status without spreadsheets—always current, always shared."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <FeatureCard
              title="Documents"
              description="Files live where the work happens—linked to matters so nothing gets lost in email."
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[0.06] bg-white py-12 md:py-14">
        <div className="mx-auto flex max-w-[1068px] flex-col items-center justify-between gap-8 px-6 text-center md:flex-row md:text-left md:px-8">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">LexOra</p>
            <p className="mt-1 text-[13px] text-[#86868b]">Legal operations, simplified.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-normal text-[#424245]">
            <Link href="/login" className="transition-colors hover:text-[#1d1d1f]">
              Sign in
            </Link>
            <Link href="/signup" className="transition-colors hover:text-[#1d1d1f]">
              Sign up
            </Link>
          </div>
          <p className="text-[12px] text-[#86868b]">© {new Date().getFullYear()} LexOra</p>
        </div>
      </footer>
    </div>
  );
}

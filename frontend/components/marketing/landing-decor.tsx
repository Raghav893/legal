"use client";

import { DotPattern } from "@/components/magicui/dot-pattern";

export function LandingDecor() {
  return (
    <>
      <DotPattern className="text-white/[0.07]" width={20} height={20} />
      <div
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,146,74,0.12)_0%,rgba(3,6,15,0)_55%)] pointer-events-none"
        aria-hidden
      />
    </>
  );
}

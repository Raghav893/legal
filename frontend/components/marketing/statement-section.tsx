"use client";

import { motion, useReducedMotion } from "framer-motion";

const phrase = "Focus on the law. LexOra handles the rest.";

export function StatementSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] py-28 md:py-36 lg:py-44">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.9),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[980px] px-6 text-center md:px-8">
        <motion.p
          className="mx-auto max-w-[820px] text-balance text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f]"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {phrase}
        </motion.p>
        <motion.p
          className="mx-auto mt-8 max-w-lg text-[17px] leading-relaxed tracking-[-0.01em] text-[#6e6e73] md:text-[19px] md:leading-[1.47]"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Intake, calendars, hearings, and documents—organized so your team sees what matters, when it matters.
        </motion.p>
      </div>
    </section>
  );
}

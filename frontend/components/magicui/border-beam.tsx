"use client";

import type { CSSProperties } from "react";
import { motion, type Transition } from "framer-motion";

import { cn } from "@/lib/utils";

export interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export function BorderBeam({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1
}: BorderBeamProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
          borderWidth: "var(--border-beam-width)",
          borderStyle: "solid",
          borderColor: "transparent",
          maskImage: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          maskClip: "padding-box, border-box",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          ...style
        } as CSSProperties
      }
    >
      <motion.div
        className={cn("absolute aspect-square rounded-full", className)}
        style={{
          width: size,
          background: `linear-gradient(to left, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          offsetRotate: "0deg"
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`]
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition
        }}
      />
    </div>
  );
}

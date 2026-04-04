"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  const gradientStops = Array.isArray(shineColor)
    ? shineColor.join(", ")
    : shineColor;

  return (
    <div
      style={
        {
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          backgroundImage: `radial-gradient(transparent, transparent, ${gradientStops}, transparent, transparent)`,
          backgroundSize: "300% 300%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position] motion-reduce:animate-none animate-shine",
        className
      )}
      {...props}
    />
  );
}

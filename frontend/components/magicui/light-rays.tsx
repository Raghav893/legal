"use client";

import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type LightRay = {
  id: string;
  left: number;
  rotate: number;
  width: number;
  delay: number;
  duration: number;
  intensity: number;
};

function createRays(count: number, cycle: number): LightRay[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => {
    const left = 8 + Math.random() * 84;
    const rotate = -26 + Math.random() * 52;
    const width = 140 + Math.random() * 180;
    const delay = Math.random() * cycle;
    const duration = cycle * (0.75 + Math.random() * 0.5);
    const intensity = 0.45 + Math.random() * 0.45;
    return {
      id: `${index}-${Math.round(left * 100)}`,
      left,
      rotate,
      width,
      delay,
      duration,
      intensity
    };
  });
}

function Ray({
  left,
  rotate,
  width,
  delay,
  duration,
  intensity,
  color,
  blur,
  length
}: LightRay & { color: string; blur: number; length: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute top-0"
      style={{
        left: `${left}%`,
        width: `${width}px`,
        height: length,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        transformOrigin: "top center",
        background: `linear-gradient(to bottom, ${color}, transparent 85%)`,
        filter: `blur(${blur}px)`
      }}
      initial={{ opacity: 0.15 * intensity }}
      animate={{ opacity: [0.12 * intensity, intensity, 0.12 * intensity] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export interface LightRaysProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  color?: string;
  blur?: number;
  speed?: number;
  length?: string | number;
}

export function LightRays({
  className,
  style,
  count = 7,
  color = "rgba(160, 210, 255, 0.2)",
  blur = 36,
  speed = 14,
  length = "70vh",
  ...props
}: LightRaysProps) {
  const cycle = Math.max(speed, 0.1);
  const [rays, setRays] = useState<LightRay[]>([]);

  useEffect(() => {
    setRays(createRays(count, cycle));
  }, [count, cycle]);

  const len = typeof length === "number" ? `${length}px` : length;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
      style={style}
      {...props}
    >
      {rays.map((ray) => (
        <Ray key={ray.id} {...ray} color={color} blur={blur} length={len} />
      ))}
    </div>
  );
}

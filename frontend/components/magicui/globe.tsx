"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const DEFAULT_CONFIG: COBEOptions = {
  devicePixelRatio: 2,
  width: 800,
  height: 800,
  phi: 0,
  theta: 0.35,
  dark: 1,
  diffuse: 0.55,
  mapSamples: 16000,
  mapBrightness: 1.15,
  baseColor: [0.22, 0.24, 0.32],
  markerColor: [184 / 255, 146 / 255, 74 / 255],
  glowColor: [0.08, 0.1, 0.16],
  markers: [
    { location: [40.7128, -74.006], size: 0.08 },
    { location: [51.5074, -0.1278], size: 0.07 },
    { location: [48.8566, 2.3522], size: 0.06 },
    { location: [28.6139, 77.209], size: 0.07 },
    { location: [35.6762, 139.6503], size: 0.06 },
    { location: [-33.8688, 151.2093], size: 0.06 },
    { location: [1.3521, 103.8198], size: 0.05 }
  ]
};

export function Globe({
  className,
  config
}: {
  className?: string;
  config?: Partial<COBEOptions>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerStart = useRef<number | null>(null);
  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const merged: COBEOptions = {
      ...DEFAULT_CONFIG,
      ...config,
      theta: config?.theta ?? DEFAULT_CONFIG.theta
    };

    const measure = () => {
      widthRef.current = canvas.offsetWidth || 400;
    };
    measure();
    window.addEventListener("resize", measure);

    const globe = createGlobe(canvas, {
      ...merged,
      width: widthRef.current * 2,
      height: widthRef.current * 2
    });

    let raf = 0;
    let alive = true;

    const frame = () => {
      if (!alive) return;
      if (pointerStart.current === null) {
        phiRef.current += 0.004;
      }
      globe.update({
        phi: phiRef.current + rs.get(),
        theta: merged.theta,
        width: widthRef.current * 2,
        height: widthRef.current * 2
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    canvas.style.opacity = "1";

    const updatePointer = (value: number | null) => {
      pointerStart.current = value;
      canvas.style.cursor = value !== null ? "grabbing" : "grab";
    };

    const onDown = (e: PointerEvent) => updatePointer(e.clientX);
    const onUp = () => updatePointer(null);
    const onMove = (e: PointerEvent) => {
      if (pointerStart.current === null) return;
      const delta = e.clientX - pointerStart.current;
      pointerStart.current = e.clientX;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerout", onUp);
    canvas.addEventListener("pointerleave", onUp);
    canvas.addEventListener("pointermove", onMove);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", measure);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerout", onUp);
      canvas.removeEventListener("pointerleave", onUp);
      canvas.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; `config` read at mount only
  }, [r, rs]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "size-full max-h-[min(560px,70vh)] max-w-[min(560px,100%)] cursor-grab opacity-0 transition-opacity duration-700",
        className
      )}
      aria-hidden
    />
  );
}

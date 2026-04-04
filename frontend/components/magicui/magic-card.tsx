"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "rgba(255, 255, 255, 0.98)",
  gradientFrom = "#9e7aff",
  gradientTo = "#fe8bbb"
}: MagicCardProps) {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const sizeRef = useRef(gradientSize);

  useEffect(() => {
    sizeRef.current = gradientSize;
  }, [gradientSize]);

  const reset = useCallback(() => {
    setPos({ x: -sizeRef.current, y: -sizeRef.current });
  }, []);

  useEffect(() => {
    const onBlur = () => reset();
    const onVis = () => {
      if (document.visibilityState !== "visible") reset();
    };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reset]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className={cn("relative rounded-[inherit]", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{
        background: `linear-gradient(${gradientColor} 0 0) padding-box, radial-gradient(${gradientSize}px circle at ${pos.x}px ${pos.y}px, ${gradientFrom}, ${gradientTo}, rgba(0,0,0,0.08) 72%) border-box`,
        border: "1px solid transparent"
      }}
    >
      {children}
    </div>
  );
}

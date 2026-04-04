"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 1 },
  animate: { "--x": "-100%" },
  whileTap: { scale: 0.97 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 10,
      damping: 5,
      mass: 0.1,
    },
  },
} as HTMLMotionProps<"button">;

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.button
        {...animationProps}
        {...(props as any)}
        ref={ref}
        className={cn(
          "relative rounded-full px-8 py-4 font-semibold backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out cursor-pointer",
          "bg-[#0a0f1e] hover:shadow-[0_0_30px_rgba(184,146,74,0.2)] border border-[rgba(184,146,74,0.3)] text-white",
          className
        )}
      >
        <span
          className="relative block h-full w-full tracking-wide opacity-90"
          style={{
            maskImage:
              "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
          }}
        >
          {children}
        </span>
        <span
          style={{
            mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
            maskComposite: "exclude",
          }}
          className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,rgba(184,146,74,0)_calc(var(--x)+20%),rgba(184,146,74,0.7)_calc(var(--x)+25%),rgba(184,146,74,0)_calc(var(--x)+100%))] p-px"
        ></span>
      </motion.button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";

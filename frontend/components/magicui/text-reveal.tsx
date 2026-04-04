"use client";

import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import { cn } from "@/lib/utils";

/** Magic UI–style scroll text reveal: `children` must be a single string. */
export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
}

export const TextReveal: FC<TextRevealProps> = ({ children, className, ...props }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.25"]
  });

  const words = children.split(" ");

  return (
    <div ref={sectionRef} className={cn("relative z-0 min-h-[130vh]", className)} {...props}>
      <div className="sticky top-0 mx-auto flex min-h-[42vh] max-w-4xl items-center px-4 py-16 md:min-h-[45vh] md:py-24">
        <p className="flex flex-wrap gap-x-2.5 gap-y-1 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-[#1d1d1f]/[0.12] md:text-4xl lg:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <RevealWord key={`${i}-${word}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </RevealWord>
            );
          })}
        </p>
      </div>
    </div>
  );
};

function RevealWord({
  children,
  progress,
  range
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-0.5 md:mx-1">
      <span className="absolute text-[#1d1d1f]/20">{children}</span>
      <motion.span style={{ opacity }} className="text-[#1d1d1f]">
        {children}
      </motion.span>
    </span>
  );
}

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]"
        }
      >
        <p
          ref={targetRef}
          className={
            "flex flex-wrap p-5 text-4xl font-extrabold text-[#ffffff10] md:p-8 md:text-5xl lg:p-10 lg:text-7xl xl:text-8xl tracking-tighter"
          }
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: any;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-2.5 bg-transparent">
      <span className={"absolute opacity-20 text-white"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-[#b8924a] drop-shadow-sm"}
      >
        {children}
      </motion.span>
    </span>
  );
};

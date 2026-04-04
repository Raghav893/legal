"use client";

import type { ReactNode } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureCard({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group h-full border border-black/[0.06] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-[22px] md:rounded-[28px]">
      <CardHeader className="space-y-0 pb-1 pt-8 md:pt-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] transition-colors duration-300 group-hover:bg-[#e8e8ed] md:h-14 md:w-14 md:rounded-[18px]">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[22px]">
          {title}
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-8 md:px-8 md:pb-10">
        <CardDescription className="text-[15px] font-normal leading-[1.5] tracking-[-0.01em] text-[#6e6e73] md:text-[17px] md:leading-relaxed">
          {description}
        </CardDescription>
      </div>
    </Card>
  );
}

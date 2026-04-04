"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function parseYmd(value: string): Date | undefined {
  if (!value) return undefined;
  const d = parseISO(value.length === 10 ? `${value}T12:00:00` : value);
  return isValid(d) ? d : undefined;
}

export interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (ymd: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** shadcn-style date picker: value / onChange use `YYYY-MM-DD` (API-friendly). */
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className
}: DatePickerProps) {
  const selected = parseYmd(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          data-empty={!value || undefined}
          className={cn(
            "h-11 w-full justify-start rounded-[10px] px-4 text-left text-sm font-normal data-[empty]:text-slate-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-60" aria-hidden />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

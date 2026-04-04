"use client";

import * as React from "react";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function splitDatetimeLocal(v: string): { date: string; time: string } {
  if (!v) return { date: "", time: "09:00" };
  const [d, t] = v.split("T");
  const time = t && t.length >= 4 ? t.slice(0, 5) : "09:00";
  return { date: d || "", time };
}

function joinDatetimeLocal(date: string, time: string): string {
  if (!date) return "";
  const t = time && time.length >= 4 ? time.slice(0, 5) : "09:00";
  return `${date}T${t}`;
}

export interface DateTimePickerProps {
  id?: string;
  value: string;
  onChange: (isoLocal: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/** Date (popover calendar) + time — value matches `datetime-local` string `YYYY-MM-DDTHH:mm`. */
export function DateTimePicker({
  id,
  value,
  onChange,
  disabled,
  required,
  className
}: DateTimePickerProps) {
  const uid = React.useId();
  const base = id ?? `dt-${uid.replace(/:/g, "")}`;
  const dateId = `${base}-date`;
  const timeId = `${base}-time`;
  const { date, time } = splitDatetimeLocal(value);

  return (
    <div className={cn("grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end", className)}>
      <div className="space-y-1.5">
        <Label htmlFor={dateId} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Date
        </Label>
        <DatePicker
          id={dateId}
          value={date}
          onChange={(d) => onChange(joinDatetimeLocal(d, time))}
          placeholder="Select date"
          disabled={disabled}
        />
      </div>
      <div className="space-y-1.5 sm:w-[140px]">
        <Label htmlFor={timeId} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Time
        </Label>
        <Input
          id={timeId}
          type="time"
          value={time}
          disabled={disabled}
          required={required}
          className="h-11"
          onChange={(e) => onChange(joinDatetimeLocal(date, e.target.value))}
        />
      </div>
    </div>
  );
}

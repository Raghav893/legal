import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default"
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  return <span className={cn("ui-badge", `ui-badge--${variant}`)}>{children}</span>;
}

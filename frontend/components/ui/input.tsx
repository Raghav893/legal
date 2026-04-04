import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[10px] border border-[hsl(var(--border))] bg-white px-4 py-2 text-sm text-[#0a0f1e] placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-[#b8924a] focus-visible:ring-[3px] focus-visible:ring-[rgba(184,146,74,0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

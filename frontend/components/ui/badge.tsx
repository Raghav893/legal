import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors border",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-[rgba(10,15,30,0.08)] text-[#0a0f1e]",
        secondary:   "border-[rgba(184,146,74,0.3)] bg-[rgba(184,146,74,0.10)] text-[#7a5c28]",
        destructive: "border-transparent bg-red-500 text-white",
        outline:     "border-border text-foreground",
        success:     "border-transparent bg-emerald-100 text-emerald-800",
        warning:     "border-transparent bg-amber-100 text-amber-800",
        muted:       "border-transparent bg-slate-100 text-slate-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-[-0.01em]",
  {
    variants: {
      variant: {
        default: "bg-[#0a0f1e] text-white shadow-[0_2px_10px_rgba(10,15,30,0.2)] hover:bg-[#1a2035] hover:shadow-[0_4px_16px_rgba(10,15,30,0.25)] active:scale-[0.98]",
        secondary: "bg-[rgba(184,146,74,0.10)] text-[#7a5c28] border border-[rgba(184,146,74,0.22)] hover:bg-[rgba(184,146,74,0.16)] hover:border-[rgba(184,146,74,0.35)]",
        outline:
          "border border-[hsl(var(--border))] bg-white text-[#0a0f1e] shadow-sm hover:bg-slate-50 hover:text-[#0a0f1e]",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-[15px]",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      default: "!bg-white !text-slate-800 border border-gray-200 shadow-sm hover:!bg-emerald-50 hover:border-emerald-500 hover:!text-emerald-700 hover:shadow-md",
      ghost: "!text-slate-800 hover:bg-slate-50 hover:!text-slate-900",
      link: "!text-slate-800 underline-offset-4 hover:underline hover:!text-emerald-700",
    }
    
    const sizes = {
      default: "px-5 py-2.5",
      sm: "px-4 py-2 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

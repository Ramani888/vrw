import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  fullPage?: boolean
  text?: string
  className?: string
}

export function Loader({ size = "md", fullPage = false, text, className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />
        {text && <p className="mt-4 text-muted-foreground">{text}</p>}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-8", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function LoaderOverlay({ size = "md", text }: Omit<LoaderProps, "fullPage">) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] z-10 rounded-md">
      <Loader2
        className={`animate-spin text-primary ${
          size === "sm" ? "h-4 w-4" : size === "lg" ? "h-12 w-12" : size === "xl" ? "h-16 w-16" : "h-8 w-8"
        }`}
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}
"use client"

import { PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

type GlassContainerProps = {
  className?: string
}

export const GlassContainer = ({
  className,
  children,
  ...props
}: PropsWithChildren<GlassContainerProps>) => {
  return (
    <div
      className={cn(
        "relative flex h-48 w-32 items-center justify-center overflow-hidden rounded-xl bg-blue-200/25",
        "text-shadow-[0_4px_10px_rgba(255,255,255,0.2)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_12px_20px_rgba(15,23,42,0.2)]",
        "backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

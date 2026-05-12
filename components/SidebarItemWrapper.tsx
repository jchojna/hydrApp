import { createElement, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type SidebarItemElement = "div" | "li"

type SidebarItemWrapperProps<T extends SidebarItemElement = "div"> = {
  as?: T
  children: ReactNode
  className?: string
  isEditMode?: boolean
}

export const SidebarItemWrapper = <T extends SidebarItemElement = "div">({
  as,
  children,
  className,
  isEditMode = false,
  ...props
}: SidebarItemWrapperProps<T>) => {
  const component = as ?? "div"

  return createElement(
    component,
    {
      ...props,
      className: cn(
        "flex min-h-11 items-center gap-1 rounded-full bg-blue-300/30 px-5 py-1 text-blue-300",
        "transition-colors duration-300",
        isEditMode && "bg-blue-600",
        className,
      ),
    },
    children,
  )
}

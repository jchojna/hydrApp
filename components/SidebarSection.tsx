import type { PropsWithChildren } from "react"

export const SidebarSection = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">{children}</div>
  )
}

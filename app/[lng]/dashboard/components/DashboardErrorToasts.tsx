"use client"

import { useMemo, useEffect } from "react"
import { toast } from "sonner"

import { Toaster } from "@/components/ui/sonner"

type DashboardErrorToastsProps = {
  errors: string[]
}

export default function DashboardErrorToasts({
  errors,
}: DashboardErrorToastsProps) {
  const uniqueErrors = useMemo(
    () => Array.from(new Set(errors.filter(Boolean))),
    [errors],
  )

  useEffect(() => {
    uniqueErrors.forEach((message, index) => {
      toast.error(message, {
        id: `dashboard-error-${index}-${message}`,
      })
    })
  }, [uniqueErrors])

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="text-muted-foreground text-sm">
        Could not load dashboard data.
      </div>
    </>
  )
}

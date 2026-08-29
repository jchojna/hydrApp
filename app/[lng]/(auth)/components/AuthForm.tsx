"use client"

import Link from "next/link"
import { type SubmitEventHandler, type ReactNode } from "react"

import { Logo } from "@/components/Logo"
import { ErrorMessage } from "@/components/ErrorMessage"
import { Button } from "@/components/ui/button"
import { GlassContainer } from "@/components/GlassContainer"

type AuthFormProps = {
  onSubmit: SubmitEventHandler<HTMLFormElement>
  apiError?: string | null
  isSubmitting: boolean
  submitLabel: string
  submittingLabel: string
  alternatePrompt: string
  alternateHref: string
  alternateLabel: string
  renderInputs: () => ReactNode
}

export const AuthForm = ({
  onSubmit,
  apiError,
  isSubmitting,
  submitLabel,
  submittingLabel,
  alternatePrompt,
  alternateHref,
  alternateLabel,
  renderInputs,
}: AuthFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[420px] p-3"
      noValidate
    >
      <GlassContainer className="flex h-full w-full flex-col items-center justify-center gap-5 p-8">
        <Logo className="mb-2.5 w-4/5 max-w-[200px]" />
        {renderInputs()}
        {apiError && <ErrorMessage message={apiError} />}
        <Button
          className="w-full bg-blue-600 text-blue-100 hover:bg-blue-700 hover:text-blue-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600 md:text-base">
            {alternatePrompt}
          </span>
          <Link
            href={alternateHref}
            className="text-sm font-semibold text-blue-100 underline md:text-base"
          >
            {alternateLabel}
          </Link>
        </div>
      </GlassContainer>
    </form>
  )
}

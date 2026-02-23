"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signInAction } from "@/actions/signIn"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"
import { signInSchema, type SignInInput } from "@/lib/validations/auth"

export default function SignIn() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    const defaultErrorMessage = "Sign in failed."

    try {
      const result = await signInAction(values)

      if (!result.success) {
        setApiError(result.message ?? defaultErrorMessage)
        return
      }

      router.push("/")
    } catch {
      setApiError(defaultErrorMessage)
      console.error(defaultErrorMessage)
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="bg-blue-dark-3 flex w-full max-w-[420px] flex-col items-center justify-center gap-5 rounded-2xl p-8"
      noValidate
    >
      <Logo />
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="email" className="text-blue-dark-1">
          Email
        </FieldLabel>
        <Input
          id="email" // TODO: use form field names
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email?.message && (
          <p className="text-sm font-medium text-red-300">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="password" className="text-blue-dark-1">
          Password
        </FieldLabel>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-sm font-medium text-red-300">
            {errors.password.message}
          </p>
        )}
      </div>
      {apiError && (
        <p className="w-full rounded-full bg-red-400/20 px-3 py-2 text-center text-sm font-medium text-red-200">
          {apiError}
        </p>
      )}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-blue-dark-1 text-sm font-medium md:text-base">
          Don&apos;t have an account?
        </span>
        <Link
          href="/signup"
          className="text-blue-light-3 text-sm font-medium underline md:text-base"
        >
          Sign Up
        </Link>
      </div>
    </form>
  )
}

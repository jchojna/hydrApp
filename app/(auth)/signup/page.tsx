"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUpAction } from "@/actions/signUp"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth"

export default function SignUp() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    const defaultErrorMessage = "Sign up failed."

    try {
      const result = await signUpAction(values)

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
    >
      <Logo />
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="email" className="text-blue-dark-1">
          Email
        </FieldLabel>
        <Input
          id="email"
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
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password?.message && (
          <p className="text-sm font-medium text-red-300">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="confirmPassword" className="text-blue-dark-1">
          Confirm Password
        </FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword?.message && (
          <p className="text-sm font-medium text-red-300">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {apiError && (
        <p className="w-full rounded-full bg-red-400/20 px-3 py-2 text-center text-sm font-medium text-red-200">
          {apiError}
        </p>
      )}
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-blue-dark-1 text-sm font-medium md:text-base">
          Already have an account?
        </span>
        <Link
          href="/signin"
          className="text-blue-light-3 text-sm font-medium underline md:text-base"
        >
          Sign In
        </Link>
      </div>
    </form>
  )
}

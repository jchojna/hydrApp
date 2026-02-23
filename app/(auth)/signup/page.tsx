"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUpAction } from "@/actions/signUp"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import {
  AuthFormField,
  signUpSchema,
  type SignUpInput,
} from "@/lib/validations/auth"
import { FormInput } from "@/components/FormInput"

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
      <FormInput
        id={AuthFormField.email}
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register(AuthFormField.email)}
      />
      <FormInput
        id={AuthFormField.password}
        label="Password"
        type="password"
        errorMessage={errors.password?.message}
        {...register(AuthFormField.password)}
      />
      <FormInput
        id={AuthFormField.confirmPassword}
        label="Confirm Password"
        type="password"
        errorMessage={errors.confirmPassword?.message}
        {...register(AuthFormField.confirmPassword)}
      />
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

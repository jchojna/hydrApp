"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signInAction } from "@/actions/signIn"
import {
  AuthFormField,
  signInSchema,
  type SignInInput,
} from "@/lib/auth/validation"
import { AuthForm } from "@/app/(auth)/components/AuthForm"
import { FormInput } from "@/components/FormInput"

export default function SignInForm() {
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
    <AuthForm
      onSubmit={onSubmit}
      apiError={apiError}
      isSubmitting={isSubmitting}
      submitLabel="Sign In"
      submittingLabel="Signing In..."
      alternatePrompt="Don&apos;t have an account?"
      alternateHref="/signup"
      alternateLabel="Sign Up"
      renderInputs={() => (
        <>
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
        </>
      )}
    />
  )
}

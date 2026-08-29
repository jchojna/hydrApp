"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { signUpAction } from "@/actions/signUp"
import {
  AuthFormField,
  signUpSchema,
  type SignUpInput,
} from "@/lib/auth/validation"
import { AuthForm } from "@/app/[lng]/(auth)/components/AuthForm"
import { FormInput } from "@/components/FormInput"
import { PasswordInput } from "@/components/PasswordInput"

export default function SignUpForm() {
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
    <AuthForm
      onSubmit={onSubmit}
      apiError={apiError}
      isSubmitting={isSubmitting}
      submitLabel="Sign Up"
      submittingLabel="Signing Up..."
      alternatePrompt="Already have an account?"
      alternateHref="/signin"
      alternateLabel="Sign In"
      renderInputs={() => (
        <>
          <FormInput
            id={AuthFormField.email}
            label="Email"
            type="email"
            errorMessage={errors.email?.message}
            {...register(AuthFormField.email)}
          />
          <PasswordInput
            id={AuthFormField.password}
            label="Password"
            errorMessage={errors.password?.message}
            {...register(AuthFormField.password)}
          />
          <PasswordInput
            id={AuthFormField.confirmPassword}
            label="Confirm Password"
            errorMessage={errors.confirmPassword?.message}
            {...register(AuthFormField.confirmPassword)}
          />
        </>
      )}
    />
  )
}

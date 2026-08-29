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
import { AuthForm } from "@/app/[lng]/(auth)/components/AuthForm"
import { FormInput } from "@/components/FormInput"
import { PasswordInput } from "@/components/PasswordInput"
import { useT } from "next-i18next/client"

export default function SignInForm() {
  const { t } = useT("ui")
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

      router.push("/dashboard")
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
      submitLabel={t("app.auth.signIn.submitLabel")}
      submittingLabel={t("app.auth.signIn.submittingLabel")}
      alternatePrompt={t("app.auth.signIn.alternatePrompt")}
      alternateHref="/signup"
      alternateLabel={t("app.auth.signIn.alternateLabel")}
      renderInputs={() => (
        <>
          <FormInput
            id={AuthFormField.email}
            label={t("app.auth.fields.email")}
            type="email"
            errorMessage={errors.email?.message}
            {...register(AuthFormField.email)}
          />
          <PasswordInput
            id={AuthFormField.password}
            label={t("app.auth.fields.password")}
            errorMessage={errors.password?.message}
            {...register(AuthFormField.password)}
          />
        </>
      )}
    />
  )
}

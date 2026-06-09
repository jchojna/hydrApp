import { HTMLInputTypeAttribute } from "react"

import { Input } from "@/components/ui/input"
import { FieldGroup, FieldLabel } from "@/components/ui/field"
import { AuthFormField } from "@/lib/auth/validation"
import { ErrorMessage } from "./ErrorMessage"

type FormInputProps = {
  id: AuthFormField
  label: string
  type: HTMLInputTypeAttribute
  errorMessage?: string
}

export const FormInput = ({
  id,
  label,
  type,
  errorMessage,
  ...props
}: FormInputProps) => {
  return (
    <FieldGroup className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor="email" className="text-blue-500">
        {label}
      </FieldLabel>
      <Input id={id} type={type} aria-invalid={!!errorMessage} {...props} />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </FieldGroup>
  )
}

import { HTMLInputTypeAttribute } from "react"

import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"
import { AuthFormField } from "@/lib/validations/auth"

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
    <div className="flex w-full flex-col gap-2">
      <FieldLabel htmlFor="email" className="text-blue-dark-1">
        {label}
      </FieldLabel>
      <Input id={id} type={type} aria-invalid={!!errorMessage} {...props} />
      {errorMessage && (
        <p className="text-sm font-medium text-red-300">{errorMessage}</p>
      )}
    </div>
  )
}

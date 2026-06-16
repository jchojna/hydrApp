import { type ComponentProps } from "react"

import { Input } from "@/components/ui/input"
import { FieldGroup } from "@/components/ui/field"
import { AuthFormField } from "@/lib/auth/validation"
import { ErrorMessage } from "./ErrorMessage"
import { FormLabel } from "./FormLabel"

type FormInputProps = {
  id: AuthFormField
  label: string
  errorMessage?: string
} & Omit<ComponentProps<typeof Input>, "id">

export const FormInput = ({
  id,
  label,
  type,
  errorMessage,
  ...props
}: FormInputProps) => {
  return (
    <FieldGroup className="flex w-full flex-col gap-2">
      <FormLabel id={id} label={label} />
      <Input id={id} type={type} aria-invalid={!!errorMessage} {...props} />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </FieldGroup>
  )
}

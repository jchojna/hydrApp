import { type ComponentProps, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { FieldGroup } from "@/components/ui/field"
import { AuthFormField } from "@/lib/auth/validation"
import { ErrorMessage } from "./ErrorMessage"
import { IconButton } from "./IconButton"
import { FormLabel } from "./FormLabel"

type PasswordInputProps = {
  id: AuthFormField
  label: string
  errorMessage?: string
} & Omit<ComponentProps<typeof Input>, "id" | "type">

export const PasswordInput = ({
  id,
  label,
  errorMessage,
  ...props
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <FieldGroup className="flex w-full flex-col gap-2">
      <FormLabel id={id} label={label} />
      <div className="relative">
        <Input
          id={id}
          type={isPasswordVisible ? "text" : "password"}
          className="pr-11"
          aria-invalid={!!errorMessage}
          {...props}
        />
        <IconButton
          type="button"
          onClick={() => setIsPasswordVisible((visible) => !visible)}
          className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-blue-200 hover:text-blue-100"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          icon={isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        />
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </FieldGroup>
  )
}

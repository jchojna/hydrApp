import { FieldLabel } from "@/components/ui/field"
import { AuthFormField } from "@/lib/auth/validation"

type FormLabelProps = {
  id: AuthFormField
  label: string
}

export const FormLabel = ({ id, label }: FormLabelProps) => {
  return (
    <FieldLabel htmlFor={id} className="text-blue-500">
      {label}
    </FieldLabel>
  )
}

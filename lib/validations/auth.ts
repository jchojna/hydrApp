import { z } from "zod"

const emailSchema = z.email("Please enter a valid email address.").trim()

const passwordSchema = z
  .string()
  .min(6, "Password must have at least 6 characters.")
  .max(40, "Password must have at most 40 characters.")

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>

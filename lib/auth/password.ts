import { hash, compare } from "bcryptjs"

const PASSWORD_SALT_ROUNDS = 12

export function hashPassword(password: string): Promise<string> {
  return hash(password, PASSWORD_SALT_ROUNDS)
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash)
}

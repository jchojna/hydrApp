"use client" // TODO: remove this later

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { Input } from "@/components/ui/input"
import { FieldLabel } from "@/components/ui/field"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null) // TODO: add validation

  return (
    <div className="bg-blue-dark-3 flex flex-col items-center justify-center gap-5 rounded-2xl p-8">
      <Logo />
      {/* TODO: create component for input with label and error */}
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="username" className="text-blue-dark-1">
          Username
        </FieldLabel>
        <Input id="username" name="username" />
        {error && (
          <p className="bg-blue-dark-5 text-blue rounded-full p-2 text-center text-sm font-medium md:text-base"></p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <FieldLabel htmlFor="password" className="text-blue-dark-1">
          Password
        </FieldLabel>
        <Input id="password" name="password" />
        {error && (
          <p className="bg-blue-dark-5 text-blue rounded-full p-2 text-center text-sm font-medium md:text-base"></p>
        )}
      </div>
      <Button className="w-full">Sign In</Button>
      <div className="flex items-center gap-2">
        <span className="text-blue-dark-1 text-sm font-medium md:text-base">
          Don&apos;t have an account?
        </span>
        <Link
          href="/signup"
          className="text-blue-light-3 text-sm font-medium underline md:text-base"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

"use client" // TODO: remove this later

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/Button"
import { Logo } from "@/components/Logo"

export default function SignIn() {
  const [error, setError] = useState<string | null>(null) // TODO: add validation

  return (
    <div className="bg-blue-dark-3 flex flex-col items-center justify-center gap-5 rounded-2xl p-8">
      <Logo />

      <label
        htmlFor="userLogin"
        className="text-blue-dark-1 text-center text-sm font-medium md:text-base"
      >
        Please, enter your login or sign up
      </label>
      <input
        id="userLogin"
        className="border-blue text-blue-light-3 focus:border-blue-light-3 min-h-[50px] w-full max-w-52 min-w-[100px] rounded-full border-2 bg-transparent p-2 px-6 text-sm transition-colors duration-200 outline-none md:text-base"
        type="text"
        maxLength={20}
        autoFocus
      />
      {error && (
        <p className="bg-blue-dark-5 text-blue rounded-full p-2 text-center text-sm font-medium md:text-base"></p>
      )}
      <Button className="w-full max-w-52">Sign In</Button>
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

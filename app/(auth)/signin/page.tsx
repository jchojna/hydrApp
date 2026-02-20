import { Button } from "@/components/Button"
import { Logo } from "@/components/Logo"
import Link from "next/link"

export default function SignIn() {
  return (
    <div className="bg-blue-dark-3 flex flex-col items-center justify-center gap-5 rounded-2xl p-5">
      <Logo />

      <label
        htmlFor="userLogin"
        className="text-blue-dark-1 text-center text-sm font-medium md:text-base"
      >
        Please, enter your login or sign up
      </label>
      <input
        id="userLogin"
        className="loginBox__input loginBox__input--js"
        type="text"
        maxLength={20}
        autoFocus
      />
      <div className="loginBox__alert loginBox__alert--js">
        <p className="loginBox__alertText"></p>
      </div>
      <Button className="">Sign In</Button>
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

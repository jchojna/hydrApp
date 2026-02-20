import { ComponentProps } from "react"
import clsx from "clsx"

export const Button = ({
  children,
  className,
  ...props
}: ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className={clsx(
        "bg-blue-dark-1 text-blue-dark-4 hover:bg-blue-dark-5 hover:text-blue-light-3 flex cursor-pointer items-center justify-center rounded-4xl px-4 py-2 text-lg font-bold transition-colors duration-200",
        className,
      )}
    >
      {children}
    </button>
  )
}

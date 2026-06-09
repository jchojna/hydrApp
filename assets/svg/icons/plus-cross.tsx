import type { SVGProps } from "react"

export const PlusCrossIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M510.7 265.7c-4.1 15-18 25.3-33.6 25.3h-186.1v186.1c0 15.6-10.2 29.5-25.3 33.6-23.5 6.4-44.7-11.2-44.7-33.7v-186h-186.1c-15.6 0-29.5-10.2-33.6-25.3-6.4-23.4 11.2-44.7 33.7-44.7h186v-186.1c0-15.6 10.2-29.5 25.3-33.6 23.4-6.4 44.7 11.2 44.7 33.7v186h186c22.5 0 40.1 21.3 33.7 44.7z"
        fill="currentColor"
      />
    </svg>
  )
}

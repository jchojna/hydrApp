import type { SVGProps } from "react"

export const PlusCircleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M512 256c0 141.4-114.6 256-256 256s-256-114.6-256-256 114.6-256 256-256 256 114.6 256 256zm-88.3 6.4c4.2-15.4-7.4-29.4-22.2-29.4h-122.5v-122.5c0-14.8-14-26.4-29.4-22.2-9.9 2.7-16.7 11.9-16.7 22.1v122.6h-122.4c-14.8 0-26.4 14-22.2 29.4 2.7 9.9 11.9 16.7 22.1 16.7h122.6v122.5c0 14.8 14 26.4 29.4 22.2 9.9-2.7 16.7-11.9 16.7-22.1v-122.7h122.5c10.3 0 19.4-6.7 22.1-16.6z"
        fill="currentColor"
      />
    </svg>
  )
}

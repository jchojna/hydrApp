import type { SVGProps } from "react"

export const ArrowUpIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M0,256C0,114.6,114.6,0,256,0s256,114.6,256,256S397.4,512,256,512S0,397.4,0,256z M232.1,167.3L88.3,311 c-10,10-10,26.1,0,36.1l0,0c10,10,26.1,10,36.1,0L256,215.4L387.6,347c10,10,26.1,10,36.1,0l0,0c10-10,10-26.1,0-36.1L279.9,167.3 C266.7,154,245.3,154,232.1,167.3z"
        fill="currentColor"
      />
    </svg>
  )
}

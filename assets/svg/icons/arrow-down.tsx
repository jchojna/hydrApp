import type { SVGProps } from "react"

export const ArrowDownIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M512,256c0,141.4-114.6,256-256,256S0,397.4,0,256S114.6,0,256,0S512,114.6,512,256z M279.9,344.8l143.8-143.8 c10-10,10-26.1,0-36.1l0,0c-10-10-26.1-10-36.1,0L256,296.6L124.4,164.9c-10-10-26.1-10-36.1,0l0,0c-10,10-10,26.1,0,36.1 l143.8,143.7C245.3,358,266.7,358,279.9,344.8z"
        fill="currentColor"
      />
    </svg>
  )
}

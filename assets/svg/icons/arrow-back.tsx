import type { SVGProps } from "react"

export const ArrowBackIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M221.9,196.3v-45.8c0-8.3-10.1-12.5-15.9-6.6l-97,97c-3.6,3.6-3.6,9.6,0,13.2l97,97c5.9,5.9,15.9,1.7,15.9-6.6V297 c85.3,0,145.1,27.3,187.7,87C392.5,298.7,341.3,213.3,221.9,196.3z M512,256c0,141.4-114.6,256-256,256S0,397.4,0,256S114.6,0,256,0 S512,114.6,512,256z"
        fill="currentColor"
      />
    </svg>
  )
}

import type { SVGProps } from "react"

export const SaveIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M266,128h37.1v78.1H266V128z M384,366.6	c0,9.6-7.8,17.4-17.4,17.4H145.4c-9.6,0-17.4-7.8-17.4-17.4V145.4c0-9.6,7.8-17.4,17.4-17.4h40.4v97h138.5v-97h0.1l52,52	c4.9,4.9,7.7,11.5,7.7,18.5V366.6z"
        fill="currentColor"
      />
    </svg>
  )
}

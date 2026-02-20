import { LOGO } from "@/app/background/utils/logo"

export const Logo = () => {
  return (
    <div className="relative z-20 mb-2.5 flex w-4/5 max-w-[300px] items-center justify-center">
      <svg className="text-blue w-full" viewBox="0 0 512 135">
        <path d={LOGO.partA.path} fill="currentColor" />
      </svg>
      <svg
        className="text-blue-light-3 absolute h-full w-full"
        viewBox="0 0 512 135"
      >
        <path d={LOGO.partB.path} fill="currentColor" />
      </svg>
    </div>
  )
}

type ErrorMessageProps = {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <p className="w-full rounded-full bg-red-500/20 px-3 py-2 text-center text-sm font-medium text-red-900">
      {message}
    </p>
  )
}

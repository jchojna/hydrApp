type ErrorMessageProps = {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <p className="w-full rounded-full bg-red-400/20 px-3 py-2 text-center text-sm font-medium text-red-200">
      {message}
    </p>
  )
}

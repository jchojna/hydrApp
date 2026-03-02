export type ActionResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
}

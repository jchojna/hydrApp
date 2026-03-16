export type ActionResponse<T = unknown> =
  | {
      success: true
      message: string
      data: T
    }
  | {
      success: false
      message: string
    }

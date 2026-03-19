export type ActionResponse<T = null> =
  | {
      success: true
      message: string
      data: T
    }
  | {
      success: false
      message: string
    }

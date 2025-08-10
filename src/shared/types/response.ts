export type ResponseMeta = { totalPages: number; currentPage: number }

export interface InterfaceResponse<T> {
  status: number
  message?: string
  data?: T
  meta?: ResponseMeta
}

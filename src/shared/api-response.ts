export type ApiSuccess<T> = {
    success: true
    data: T
    meta?: ApiMeta
}

export type ApiMeta = {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
}

export type ApiError = {
    success: false
    error: {
        message: string
        code: string
        details?: unknown
    }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
export type RefreshTokenPayload = {
    sub: string
    jti: string
    iat: number
    exp: number
}

export type AccessTokenPayload = {
    sub: string
    iat: number
    exp: number
}

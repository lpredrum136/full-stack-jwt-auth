import { Secret, sign } from 'jsonwebtoken'
import { User } from '../entities/User'
import { Response } from 'express'

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
  sign(
    {
      userId: user.id,
      ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {})
    },
    type === 'accessToken'
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === 'accessToken' ? '15m' : '60m'
    }
  )

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie(
    process.env.REFRESH_TOKEN_COOKIE_NAME as string,
    createToken('refreshToken', user),
    {
      httpOnly: true,
      // secure: true,
      secure: false,
      sameSite: 'none'
      // domain: 'http://localhost:3000'
    }
  )
}

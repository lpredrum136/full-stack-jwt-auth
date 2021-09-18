import { sign } from 'jsonwebtoken'
import { User } from '../entities/User'

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
  sign(
    { userId: user.id },
    type === 'accessToken'
      ? (process.env.ACCESS_TOKEN_SECRET as string)
      : (process.env.REFRESH_TOKEN_SECRET as string),
    {
      expiresIn: '15m'
    }
  )

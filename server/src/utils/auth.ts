import { Secret, sign } from 'jsonwebtoken'
import { User } from '../entities/User'

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
  sign(
    { userId: user.id },
    type === 'accessToken'
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: '15m'
    }
  )

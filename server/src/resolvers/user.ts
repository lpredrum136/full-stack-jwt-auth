import { User } from '../entities/User'
import {
  Arg,
  Ctx,
  ID,
  // Ctx,
  // FieldResolver,
  Mutation,
  Query,
  // Query,
  Resolver
  // Root
} from 'type-graphql'
import argon2 from 'argon2'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { LoginInput } from '../types/LoginInput'
import { Context } from '../types/Context'
import { createToken, sendRefreshToken } from '../utils/auth'
// import { validateRegisterInput } from '../utils/validateRegisterInput'
// import { LoginInput } from '../types/LoginInput'
// import { Context } from '../types/Context'
// import { ForgotPasswordInput } from '../types/ForgotPassword'
// import { ChangePasswordInput } from '../types/ChangePasswordInput'

@Resolver(_of => User)
export class UserResolver {
  // @FieldResolver(_return => String)
  // email(@Root() user: User, @Ctx() { req }: Context) {
  // 	return req.session.userId === user.id ? user.email : ''
  // }

  // @Query(_return => User, { nullable: true })
  // async me(@Ctx() { req }: Context): Promise<User | undefined | null> {
  // 	if (!req.session.userId) return null
  // 	const user = await User.findOne(req.session.userId)
  // 	return user
  // }

  @Query(_return => [User])
  async users(): Promise<User[]> {
    return await User.find()
  }

  @Mutation(_return => UserMutationResponse)
  async register(
    @Arg('registerInput') registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const { username, password } = registerInput
    const existingUser = await User.findOne({ username })
    if (existingUser)
      return {
        code: 400,
        success: false,
        message: 'Duplicated username',
        errors: [
          {
            field: 'username',
            message: 'Username already taken'
          }
        ]
      }

    const hashedPassword = await argon2.hash(password)

    const newUser = User.create({
      username,
      password: hashedPassword
    })

    await newUser.save()

    return {
      code: 200,
      success: true,
      message: 'User registration successful',
      user: newUser
    }
  }

  @Mutation(_return => UserMutationResponse)
  async login(
    @Arg('loginInput') { username, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne({ username })

    if (!existingUser)
      return {
        code: 400,
        success: false,
        message: 'User not found',
        errors: [{ field: 'username', message: 'Username or email incorrect' }]
      }

    const passwordValid = await argon2.verify(existingUser.password, password)

    if (!passwordValid)
      return {
        code: 400,
        success: false,
        message: 'Wrong password',
        errors: [{ field: 'password', message: 'Wrong password' }]
      }

    // return cookie
    sendRefreshToken(res, existingUser)

    return {
      code: 200,
      success: true,
      message: 'Logged in successfully',
      user: existingUser,
      accessToken: createToken('accessToken', existingUser)
    }
  }

  // This can also be used as a revokeRefreshTokens call
  @Mutation(_return => UserMutationResponse)
  async logout(
    @Arg('userId', _type => ID) userId: number,
    @Ctx() { res }: Context
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne(userId)

    if (!existingUser) {
      return { code: 400, success: false }
    }

    existingUser.tokenVersion += 1
    await existingUser.save()
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string)

    return { code: 200, success: true }
  }

  // @Mutation(_return => Boolean)
  // logout(@Ctx() { req, res }: Context): Promise<boolean> {
  //   return new Promise((resolve, _reject) => {
  //     res.clearCookie(COOKIE_NAME)

  //     req.session.destroy(error => {
  //       if (error) {
  //         console.log('DESTROYING SESSION ERROR', error)
  //         resolve(false)
  //       }
  //       resolve(true)
  //     })
  //   })
  // }
}

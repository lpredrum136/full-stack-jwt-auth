import { Context } from '../types/Context'
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { checkAuth } from '../middleware/checkAuth'

@Resolver()
export class GreetingResolver {
  @Query()
  hello(): string {
    return 'hello world henry'
  }

  @Query()
  @UseMiddleware(checkAuth)
  goodbye(@Ctx() { user }: Context): string {
    return `goodbye user with id ${user.userId}`
  }
}

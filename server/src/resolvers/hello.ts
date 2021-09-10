import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloResolver {
  @Query()
  hello(): string {
    return 'hello world henry';
  }
}

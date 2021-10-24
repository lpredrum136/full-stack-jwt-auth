require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import { createServer } from 'http'
import { GreetingResolver } from './resolvers/greeting'
import { UserResolver } from './resolvers/user'
import { Context } from './types/Context'
import cookieParser from 'cookie-parser'
import { JwtPayload, Secret, verify } from 'jsonwebtoken'
import { UserAuthPayload } from './types/UserAuthPayload'
import { createToken, sendRefreshToken } from './utils/auth'
import cors from 'cors'

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'jwt-auth',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User]
  })

  const app = express()

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
  app.use(cookieParser())

  // To refresh token
  app.get('/refresh_token', async (req, res) => {
    console.log(req.headers)
    console.log(req.cookies) // tuong la se doc duoc cookie nhung k duoc, can phai co cookie-parser

    const refreshToken =
      req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]

    console.log('REFRESH TOKEN', refreshToken)

    if (!refreshToken) return res.sendStatus(401)

    try {
      const decodedUser = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret
      ) as UserAuthPayload & JwtPayload

      // token is valid
      const user = await User.findOne(decodedUser.userId)

      if (!user || user?.tokenVersion !== decodedUser.tokenVersion) {
        return res.sendStatus(401)
      }

      sendRefreshToken(res, user)

      return res.json({
        success: true,
        accessToken: createToken('accessToken', user)
      })
    } catch (error) {
      console.log('ERROR REFRESHING TOKEN', error)
      return res.sendStatus(403)
    }
  })

  const httpServer = createServer(app)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [GreetingResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): Pick<Context, 'req' | 'res'> => ({
      req,
      res
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground() // added for classic playground, screw Sandbox
    ]
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    // cors: { origin: 'https://studio.apollographql.com', credentials: true } // studio works, playground works, FE not working
    cors: { origin: 'http://localhost:3000', credentials: true } // studio not working, playground works, FE works
    // cors: false // studio not working, playground works, FE not working
    // cors: { origin: '*', credentials: true } // everything works
    // nothing? // everything works
  })

  const PORT = process.env.PORT || 4000

  await new Promise(resolve =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  )

  // app.listen(5000, () => console.log(`REST server started on PORT 5000`))

  console.log(
    `Server started on port ${PORT}. GraphQL endpoint on http://localhost:${PORT}/graphql or http://localhost:${PORT}${apolloServer.graphqlPath}`
  )
}

main().catch(error => console.log(error))

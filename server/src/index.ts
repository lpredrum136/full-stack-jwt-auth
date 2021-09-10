require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'jwt-auth',
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User],
  });

  const app = express();

  const httpServer = createServer(app);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
    // context: ({ req, res }): Context => ({
    // 	req,
    // 	res,
    // 	connection,
    // 	dataLoaders: buildDataLoaders()
    // }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );

  console.log(
    `Server started on port ${PORT}. GraphQL endpoint on http://localhost:${PORT}/graphql or http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
};

main().catch((error) => console.log(error));

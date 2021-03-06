import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import mikroOrmConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"

const main = async () => {
  
  const orm = await MikroORM.init(mikroOrmConfig)
  await orm.getMigrator().up()

  const app = express()
  
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ PostResolver, UserResolver ],
      validate: false
    }),
    context: () => ({
      em: orm.em
    }),
    playground: true,
    introspection: true
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  })

  app.get("/", (_req, res) => {
    res.send("hello world")
  })
}

main().catch((err) => {
  console.error(err);
})